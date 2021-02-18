import { Navigation } from 'react-native-navigation'


export const showAlert = (componentId, title, message, cbFunction) => Navigation.showOverlay({
  component: {
    id: 'Alert',
    name: 'AlertScreen',
    options: {
      overlay: {
        interceptTouchOutside: false // this make touch events pass through the invisible parts of the overlay
      }
    },
    passProps: {
      componentId: componentId,
      title: title,
      message: message,
      cbFunction: cbFunction
    },
  }
})

export const showCreatePortfolio = (componentId, title, message, cbFunction) => Navigation.showOverlay({
  component: {
    id: 'CreatePortfolio',
    name: 'CreatePortfolioScreen',
    options: {
      overlay: {
        interceptTouchOutside: false // this make touch events pass through the invisible parts of the overlay
      }
    },
    passProps: {
      componentId: componentId,
      title: title,
      message: message,
      cbFunction: cbFunction
    },
  }
})

export const goToLogin = () => Navigation.setRoot({
  root: {
    component: {
      id: 'LoginScreen',
      name: 'LoginScreen'
    },
  },
}); 

export const goToSignUp = (props) => Navigation.setRoot({
  root: {
    component: {
      id: 'mySignUpscreen',
      name: 'SignUpScreen'
    },

  },
});

export const showForgotPasswordModal = (props) => Navigation.setRoot({
  root: {
    component: {
      id: 'ForgotPwdScreen',
      name: 'ForgotPwdScreen'
    },
  },
});

export const showSearchModal = (portfolioId, symbols, saveSymbolsRef) => Navigation.showModal({
  stack: {
    children: [{
      component: {
        id: 'QuoteLookupScreen',
        passProps: {
          symbols: symbols,   // pass in an array of 'existing' symbols for a portfolio to pre-fill the quote search
          portfolioId: portfolioId,  // the specific portfolio to add the new symbols
          saveSymbolsRef: saveSymbolsRef
        },
        name: 'QuoteLookupScreen',
        options: {
          topBar: {
            title: {
              text: 'Search',
              visible: true,
              drawBehind: true,
              background: {
                color: '#000'
              }
            },
          },
        }
      }
    }]
  }
});

export const showPorfolioEditModal = (portfolioId, symbols, portfolioName) => Navigation.showModal({
  stack: {
    children: [{
      component: {
        id: 'PortfolioEditScreen',
        passProps: {
          symbols: symbols,
          portfolioId: portfolioId,  // the specific portfolio to add the new symbols
          portfolioName: portfolioName
        },
        name: 'PortfolioEditScreen',
        options: {
          topBar: {
            title: {
              text: 'Edit Portfolio',
              visible: true,
              drawBehind: true,
              background: {
                color: '#000'
              }
            },
          },
        }
      }
    }]
  }
});

export const showPorfolioEditDetailsModal = (portfolioId, symbols) => Navigation.showModal({
  stack: {
    id: 'MyStack',
    children: [
      {
        component: {
          id: 'TaxLotListScreen',
          passProps: {
            symbols: symbols,
            portfolioId: portfolioId  // the specific portfolio to add the new symbols
          },
          name: 'TaxLotListScreen',
          options: {
            topBar: {
              title: {
                text: 'Multiple Lots',
                visible: false,
                drawBehind: true,
                background: {
                  color: '#000'
                }
              },
            },
            animations: {
              push: {
                waitForRender: true
              }
            }
          }
        },
        component: {
          id: 'TaxLotEditDetailScreen',
          passProps: {
            symbols: symbols,
            portfolioId: portfolioId  // the specific portfolio to add the new symbols
          },
          name: 'TaxLotEditDetailScreen',
          options: {
            topBar: {
              title: {
                text: 'Tax Lots',
                visible: false,
                drawBehind: true,
                background: {
                  color: '#000'
                }
              },
            },
            animations: {
              push: {
                waitForRender: true
              }
            }
          }
        }
      },
      {
      component: {
        id: 'PortfolioEditDetailScreen',
        passProps: {
          symbols: symbols,
          portfolioId: portfolioId  // the specific portfolio to add the new symbols
        },
        name: 'PortfolioEditDetailScreen',
        options: {
          topBar: {
            title: {
              text: 'Holdings',
              visible: true,
              drawBehind: true,
              background: {
                color: '#000'
              }
            },
          },
          animations: {
            push: {
              waitForRender: true
            }
          }
        }
      }
    }]
  }
});

export const showQuoteDetailModal = (symbol, company) => Navigation.showModal({
  stack: {
    children: [{
      component: {
        id: 'QuoteDetailScreen',
        passProps: {
         symbol: symbol,
         company: company
        },
        name: 'QuoteDetailScreen',
        options: {
          topBar: {
            title: {
              text: 'Detail',
              visible: true,
              drawBehind: true,
              background: {
                color: '#000'
              }
            },
          },       
        }
      }
   }]
  }
});

export const showSettingsModal = () => Navigation.showModal({
  stack: {
    children: [{
      component: {
        id: 'SettingsScreen',
        name: 'SettingsScreen',
        options: {
          topBar: {
            title: {
              text: "Settings",
              color: 'white',
              fontSize: 25,
            },
            backgroundColor: '#252526',
            color: 'white',
            visible: true,
            drawBehind: true,
            background: {
              color: '#000'
            },
            rightButtons: [
              {
                id: 'closeModal',
                text: 'Close',
                color: 'lightgreen'
              }
            ]
          },

        }
      }
    }]
  }
});


export const goToPortfolioSummary = () => Navigation.setRoot({
  root: {
    bottomTabs: {
      id: 'BottomTabsId',
      options: {
        bottomTabs: {
          animate: true,
          titleDisplayMode: 'alwaysShow',
          barStyle: 'blackOpaque',
          hideShadow: false,
          iconColor: 'white',
          textColor: 'white',
          selectedIconColor: 'deepskyblue',
          selectedTextColor: 'white',
        },
      },
      children: [
        {
          stack: {
            children: [
              {
                component: {
                  id: 'PortfolioScreen',
                  name: 'PortfolioScreen',
                  text: 'Portfolio',
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('../../img/icon-portfolio.png'),
                text: 'Portfolio',
                color: 'white',
                iconColor: 'white',
                textColor: 'white',
                selectedIconColor: 'deepskyblue',
                selectedTextColor: 'lightsteelblue',
              },
               topBar: {
                visible: true,
                 text: "Portfolio",
                 rightButtons: [
                   {
                     id: 'settingsModal',
                     icon: require('../../img/person.png')
                   }
                 ],
                 drawBehind: true,
                 background: {
                   color: '#000'
                 }
              }, 
              animations: {
                push: {
                  waitForRender: true
                }
              }

            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  id: 'MarketsScreen',
                  name: 'MarketsScreen',
                  text: 'Markets',
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('../../img/icon-holdings.png'),
                text: 'Markets',
                color: 'white',
                iconColor: 'white',
                textColor: 'white',
                selectedIconColor: 'deepskyblue',
                selectedTextColor: 'lightsteelblue',
              },
              topBar: {
                visible: true,
                drawBehind: true,
                background: {
                  color: '#000'
                }
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  id: 'NewsScreen',
                  name: 'NewsScreen',
                  text: 'News',
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('../../img/icon-activity2.png'),
                text: 'News',
                color: 'white',
                iconColor: 'white',
                textColor: 'white',
                selectedIconColor: 'deepskyblue',
                selectedTextColor: 'lightsteelblue',
              },
              topBar: {
                visible: true,
                drawBehind: true,
                background: {
                  color: '#000'
                }
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  id: 'QuoteResearchScreen',
                  name: 'QuoteResearchScreen',
                  text: 'Research',
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('../../img/icon-search-32.png'),
                text: 'Research',
                color: 'white',
                iconColor: 'white',
                textColor: 'white',
                selectedIconColor: 'deepskyblue',
                selectedTextColor: 'lightsteelblue',
              },
              topBar: {
                visible: true,
                drawBehind: true,
                background: {
                  color: '#000'
                }
              },
            },
          },
        }      
      ],
    },
  },
});
   

