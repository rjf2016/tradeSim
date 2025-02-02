import { observable, computed, toJS, autorun } from 'mobx';
import Firebase from 'firebase';
import autobind from 'autobind-decorator';
import { getRealtime } from '../stores/QuotesStore';

@autobind
class HoldingsStore {  
  @observable _Portfolios = [];  // Hiearchy of this object: Portfolios->Holdings->TaxLots
  @observable _SymbolPrices = [];  // Holds market data quote information separately for easy lookup
  @observable _Balances = {};
  @observable _IsLoading = {loading: true};
  @observable _UniqueSymbols = []; // all unique symbols across every portfolio (used to make the realtime API calls to market data)
  uid = null;
  portfolios = {};  //straight json version of this._Portfolios (Observable/Proxy)

  constructor() {  
      Firebase.auth().onAuthStateChanged((user) => {  
        if(!user)  
          return this.IsLoading = { loading: true }

        uid = user.uid; //unique user id after firebase authentication     
        
        this.Portfolios = [];
        this.Balances = {};
        try {   
          this.IsLoading = { loading: true }
          const holdings =  this.fetchHoldingsByPortfolio();

          //mobx autorun;  will run once after fetchHoldingsPortfolio returns at some point
          this.handler = autorun(() => {
            if (this.Portfolios.length)  {           
              console.log("---- Debug: Completed FetchHoldingsByPortfolio ----")
              var holdingsSymbols = this.getUniqueHoldingsFromPortfolios(this.Portfolios);
              this.UniqueSymbols = holdingsSymbols;
              if (holdingsSymbols.length) {
                this.getRealtimePrices(holdingsSymbols).then(r => {
                     this.calculatePerformance();
                     this.handler();  // Disable After running once 
                     this.IsLoading = { loading: false }
                }) 
              }
              else {
                 this.Balances = {};
                 this.handler();  // Disable After running once to avoid expensive API calls (market data pricing)
                 this.IsLoading = { loading: false }
              }
             } 
            })          
            }
            catch (error) {
                  console.log('Error occurred during mainFetch() call', error);
            }    
        });    
}

async main() {
  try {
      const s = await this.mainFetch().then(r => {
        this.IsLoading = { loading: false };  
      })
  }
  catch(error) {
    console.log('Error occurred in main() call', error);
  } 
}

async mainFetch() {
  this.IsLoading = {loading: true}
  const holdings = await this.fetchHoldingsByPortfolio();
  const holdingsSymbols = this.UniqueSymbols;
 
  this.getRealtimePrices(holdingsSymbols).then(r => {
        this.calculatePerformance();
  })
}

async fetchHoldingsByPortfolio() {
    if (!uid)
      return;

    return Firebase.database().ref().child('portfolios/' + uid).on('value', (snapshot) => {  
      if (snapshot.val()) {
        try {
          const fbData = Object.values(snapshot.val());
          if (fbData === undefined || fbData.length == 0) {
            this.Balances = {};
            return this.Portfolios = portfolios = [];
          }
   
          portfolios = toJS(fbData);        
          this.Portfolios = fbData;       
          this.UniqueSymbols = this.getUniqueHoldingsFromPortfolios(fbData);        
        } catch (error) {
          console.log('error occurred!', error);
        }
      }
      else {
        this.IsLoading = { loading: false }  
        this.Balances = {}; 
        return this.Portfolios = portfolios = [];  
      }
    });
  }

getUniqueHoldingsFromPortfolios(fbData) {
    var symbolList = [];

    for(var i=0; i<fbData.length; i++) {  //loop portfolios
      for (var symbol in fbData[i].holdings) {
      if (symbolList.indexOf(symbol) === -1)
        symbolList.push(symbol); 
      }
    }
   return symbolList;
  }

async getRealtimePrices(symbollist) {  
    var symbolPrices = [];

   if (symbollist === undefined || symbollist.length == 0)
       return symbolPrices;
    // Calls the QuotesStore that ultimately calls the marketdata API to get realtime quotes
    return await getRealtime(symbollist)   
      .then(res => { 
          symoblPrices = res;
          this.SymbolPrices = res;
          return res;
      });      
  } 

//Calculates Total Gains and Day's Performance for 'each' Portfolio plus a Total (aggregate)
//performance across ALL PORTFOLIOS
//Note: uses simple weighted average unit cost for holdings with multiple taxlots (i.e. MSFT bought 3 separate dates, different prices)
calculatePerformance() {   
  if(!this.Portfolios.length || !this.SymbolPrices.length)
   return;

  var newArray = [];
   var totBegMktVal = totEndMktVal = totOrigBegMktVal = 0; 
   Object.entries(this.Portfolios).forEach(entry => {
     const [key, value] = entry;
      var begMktVal = endMktVal = origBegMktVal = 0;    //origBegMktVal = initial cost of stock
      var portfolioId = value.id

     if (value.taxlots) {     // if the user entered their positions (Qty, Unit Price), calculate their gains/losses
       var o = toJS(value.taxlots);
       Object.entries(o).forEach(entry => {
            const [key, value] = entry;
            let r = Object.values(value);
            const qty = Object.values(r).reduce((r, { quantity }) => r + quantity, 0); //sum the quantities for each symbol
            
            //get weighted average unit cost
            const unitCost = (Object.values(r).reduce((r, { totalVal }) => r + totalVal, 0) / qty); //sum the costs for each purchase          
            const p = this.getCurrentPrices(key);
                     
            var open_price = p.calculationPrice == 'close' ? p.previousClose : p.previousClose;
            var close_price = p.calculationPrice == 'close' ? p.latestPrice : p.latestPrice;
            begMktVal = begMktVal + (qty * open_price);
            endMktVal = endMktVal + (qty * close_price);
            totBegMktVal = totBegMktVal + (qty * open_price);
            totEndMktVal = totEndMktVal + (qty * close_price);     
            //Keep track of the original values to use for Total Portfolio Gains or Losses based on 'original' purchase prices
            origBegMktVal = origBegMktVal + (qty * unitCost);
            totOrigBegMktVal = totOrigBegMktVal + (qty * unitCost);  
       });
  
       var todayPerf = endMktVal <= 0 ? 0 : ((1 - (begMktVal / endMktVal)) * 100).toFixed(2)
       var totalGL = endMktVal <= 0 ? 0 : (endMktVal - origBegMktVal).toFixed(2)
     
       newArray.push({
         id: portfolioId, performance: {
           totalPortfolioValue: endMktVal.toFixed(2),
           todayGain: (endMktVal - begMktVal).toFixed(2),
           todayGainPct: todayPerf,
           totalGain: totalGL,
           totalGainPct: (((endMktVal - origBegMktVal) / origBegMktVal) * 100).toFixed(2)
         }
       })

      begMktVal = endMktVal = origBegMktVal = 0;  //reset values and move to next symbol held in the portfolio
     }
   });

   var totTodayPerf = totEndMktVal <= 0 ? 0 : ((1 - (totBegMktVal / totEndMktVal)) * 100).toFixed(2)
   var totalGain = totEndMktVal <= 0 ? 0 : (totEndMktVal - totOrigBegMktVal).toFixed(2)

   newArray.push({id: "Total", performance: { totalPortfolioValue: totEndMktVal.toFixed(2), 
                    todayGain: (totEndMktVal - totBegMktVal).toFixed(2),
                    todayGainPct: totTodayPerf, 
                    totalGain: totalGain,
                    totalGainPct: (((totEndMktVal - totOrigBegMktVal) / totOrigBegMktVal)*100).toFixed(2)}})
   this.Balances = newArray;
 }

getBalances(portfolioId) {
  try {
    return this.Balances.find(x => x.id === portfolioId).performance;
  }
  catch(error) {
    console.log('No Balances for this Portfolio: ', error);
    return null;
  }
}
getShareQuantity(portfolioId, symbol) {
    var qty = 0;
    try {
       var l = portfolios.find(x => x.id === portfolioId);
       if (l.taxlots === undefined)
         return 0;

       var lots = l.taxlots[symbol];

       if(lots)
         qty = Object.values(lots).reduce((r, { quantity }) => r + quantity, 0);

        return qty;
        } catch(error) {
              console.log('getShareQuantity Error: ', error);
              return qty;
        }
  }

getCurrentPrices(symbol) {
    for (var i = 0; i < this.SymbolPrices.length; i++) {
      if (this.SymbolPrices[i].symbol == symbol)
        return this.SymbolPrices[i];
    }
  }

getTaxLots(portfolioId, symbol) {
  const l = portfolios.find(x => x.id === portfolioId);
  if (l.taxlots === undefined)
    return [];
  
  var lots = l.taxlots[symbol];
  var s = [];
  for (var key in lots) 
    s.push(lots[key])
  
  return s;
}

deleteSymbols(portfolioId, symbollist) {
    var updates = {};
    for (var i = 0; i < symbollist.length; i++) {
      updates["/holdings/" + symbollist[i]] = null;
      updates["/taxlots/"  + symbollist[i]] = null;
    }

    const ref = Firebase.database().ref('portfolios/' + uid + '/' + portfolioId);

    ref.update(updates).then(f => {
      this.calculatePerformance();
    }).catch(function (error) {
      console.log("Data could not be saved." + error);
    }); 
  }

deletePortfolio(portfolioId) {
    Firebase.database().ref('portfolios/' + uid + '/' + portfolioId).remove().then(f => {
      this.main();
    }).catch(function (error) {
      console.log("Portfolio could not be deleted." + error);
    }); 
  }

updatePortfolioName(portfolioId, portfolioName) { 
    Firebase.database().ref('portfolios/' + uid + '/' + portfolioId).update({portfolioName: portfolioName})
      .then().catch(function (error) {
        console.log("Portfolio Name could not be Updated." + error);
      });
  }

createPortfolio(portfolioName) {  
    var postsRef = Firebase.database().ref('portfolios/' + uid).push();
    var postId = postsRef.key;
    Firebase.database().ref('portfolios/' + uid + '/' + postId).set({
      id: postId,
      portfolioName: portfolioName,
      createdAt: new Date().getTime()
    }).then().catch(function (error) {
      console.log("Portfolio could not be Created." + error);
    }); 
  }

deleteTaxLot(portfolioId, symbol, id) {
     Firebase.database().ref('portfolios/' + uid + '/' + portfolioId + "/taxlots/" + symbol + "/" + id).remove().then(f => {
       this.calculatePerformance();  //recalculate everything
     }).catch(function (error) {
       console.log("Delete Tax Lot failed." + error);
     }); 
  }
  
addTaxLot(portfolioId, symbol, company, quantity, price, tradeDate) {
  var ref = Firebase.database().ref('portfolios/' + uid + '/' + portfolioId);

  var newPostRef = ref.child("taxlots").push();
  var newPostKey = newPostRef.key;
  var updatedUserData = {};
  updatedUserData["taxlots/" + symbol + "/" + newPostKey] = true;
  updatedUserData["taxlots/" + symbol + "/" + newPostKey] = {
    action: '', company: '', id: newPostRef.key, price: price, quantity: quantity, tradeDate: tradeDate, symbol: symbol, totalVal: quantity * price
  };

  var qty = this.getShareQuantity(portfolioId, symbol);
  updatedUserData["holdings/" + symbol] = {quantity: qty, symbol: symbol, company: company, price: 0, sectype:'EQ'};
 
  ref.update(updatedUserData).then( f=> {
    this.calculatePerformance();
  }).catch(function (error) {
    console.log("Tax Lot data could not be saved." + error);
  }); 
}

updateTaxLot(portfolioId, taxlotId, symbol, quantity, price, tradeDate) {
   Firebase.database().ref('portfolios/' + uid + '/' + portfolioId + '/taxlots/' + symbol + "/" + taxlotId).update({
        quantity: quantity, price: price, tradeDate: tradeDate, totalVal: quantity * price}).then(res => {
          this.calculatePerformance();
   });
  }

addSymbols(portfolioId, symbols) {
  var ref = Firebase.database().ref('portfolios/' + uid + '/' + portfolioId + "/");
  var updatedUserData = {};

  if (portfolioId && symbols) {
    for (var i = 0; i < symbols.length; i++) {
      updatedUserData["holdings/" + symbols[i].symbol] = { quantity: 0, symbol: symbols[i].symbol, company: symbols[i].company, price: 0, sectype: 'EQ' };
    }
    
    ref.update(updatedUserData).then(f => {
      this.main();
    }).catch(function (error) {
      console.log("Data could not be saved." + error);
    });  
  }
}

@computed get IsLoading() {
    return this._IsLoading;  
  }

  set IsLoading(data) {
    if (!data)
      return;
    this._IsLoading = data;
  }

@computed get portolioCount() {
    return this.Portfolios.length;
}

@computed get Portfolios() {
    return this._Portfolios;  
  }

  set Portfolios(data) {
    if (!data)
      return;
    this._Portfolios = data;
  }

@computed get SymbolPrices() {
    return this._SymbolPrices; 
  }

  set SymbolPrices(data) {
    if (!data)
      return;
    this._SymbolPrices = data;
  }

@computed get UniqueSymbols() {
    return this._UniqueSymbols;  
  }

  set UniqueSymbols(data) {
    if (!data)
      return;
    this._UniqueSymbols = data;
  }

@computed get Balances() {
    return this._Balances;  
  }

  set Balances(data) {
    if (!data)
      return;
    this._Balances = data;
  }
}
export default new HoldingsStore()


