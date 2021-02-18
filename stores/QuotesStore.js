import { observable, computed } from 'mobx';
import autobind from 'autobind-decorator';
import search from '../utils/search';
import realtime from '../utils/realtime';
import quote from '../utils/quote';
import cryptoQuote from '../utils/cryptoQuote';
import chart from '../utils/chart';
import marketsrealtime from '../utils/marketsrealtime';
import authstore from '../stores/AuthStore';

@autobind
class QuotesStore {
  @observable _currentSymbol = '';
  @observable _Markets = [];

  @computed
  get Markets() {
    return this._Markets || ''
  }
  set Markets(data) {
    this._Markets = data
  }
  @computed
  get currentSymbol() {
    return this._currentSymbol || ''
  }
  set currentSymbol(symbol) {
    this._currentSymbol = symbol
  }

  async getSymbols(symbol) {
    let searchSymbol = symbol.toUpperCase().trim();

    try {
      return await search({
        search_term: searchSymbol, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url, options: ''
      });
    } catch (error) {
      throw error;
    }
  }

}
export default new QuotesStore()

export const getSymbols = async(symbol) => {
  let searchSymbol = symbol.toUpperCase().trim();

  try {
      return await search({
        search_term: searchSymbol, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url, options: ''
      });
    } catch (error) {
      throw error;
    }
}

export const getMarkets = async (category) => {
  console.log('--- Debug: Markets Realtime API called ----')
  try {
    const data = await marketsrealtime({ API_TOKEN: authstore.api_ref, API_URL: authstore.api_url})
        let newArray = [];
        if(data) {
            newArray.push({ id: "1", category: 'Most Active', data: data[0]})
            newArray.push({ id: "2", category: 'Gainers', data: data[1] })
            newArray.push({ id: "3", category: 'Losers', data: data[2] })
        }
        return this.Markets = newArray;  
    } catch (error) {
      throw error;
    }
}

export const getQuote = async (symbol) => {
  try {
      return await quote({ symbol: symbol, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url });
    } catch (error) {
       throw error;
    }
}

export const getCrypto = async (symbols) => {
  try {
    return await cryptoQuote({ symbols: symbols, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url });
  } catch (error) {
    throw error;
  }
}

export const getChart = async (symbol, timeFrame, options) => {
  try {
    return await chart({ symbol: symbol, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url, timeFrame: timeFrame, options: options });
  } catch (error) {
    throw error;
  }
}

export const getRealtime = async (symbols) => {
  try {
    const data = await realtime({ symbols: symbols, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url, options: 'range=1m&types=quote&symbols' });
      var newArray = [];

      let datalist = Object.values(data);
      
      datalist.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
          newArray.push(value.quote)
        });
      });
      return newArray;

  } catch (error) {
    throw error;
  }
}
