import autobind from 'autobind-decorator';
import news from '../utils/news';
import authstore from '../stores/AuthStore';

@autobind
class NewsStore {
  
}
export default new NewsStore()

export const getNewsBySymbol = async (symbols) => {
 
  if (!symbols)
    return;

  console.log('--- Debug: Markets News API called ----')
  const data = await news({ symbols: symbols, API_TOKEN: authstore.api_ref, API_URL: authstore.api_url, options: 'range=1m&types=quote&symbols' });

  let newArray = [];

  let alist = Object.values(data);
  Object.entries(alist).forEach(([key, value]) => {
    Object.entries(value).forEach(([ky, vv]) => {
      Object.entries(vv).forEach(([k, v]) => {
        for (var i = 0; i < v.length; i++) {
          newArray.push({
            datetime: v[i].datetime,
            source: v[i].source,
            headline: v[i].headline,
            url: authstore.api_isProduction == true ? v[i].url : '',
            summary: v[i].summary,
            related: v[i].related,
            image: authstore.api_isProduction == true ? v[i].image : null,
            lang: v[i].lang,
            hasPaywall: v[i].hasPaywall
          })
        };
      });
    });
  });

  return newArray;
}