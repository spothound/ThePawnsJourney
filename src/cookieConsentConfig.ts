import { acceptedCategory } from 'vanilla-cookieconsent';
import { acceptedService } from 'vanilla-cookieconsent';
import VueGtag, { bootstrap } from 'vue-gtag';

const cookieConsentConfig = {
    categories: {
      necessary: {
          enabled: true,  // this category is enabled by default
          readOnly: true  // this category cannot be disabled
      },
      analytics: {}
  },

  guiOptions: {
      consentModal: {
          layout: 'bar',
          position: 'bottom',
          flipButtons: true,
          equalWeightButtons: true
      },
      preferencesModal: {
          layout: 'box',
          // position: 'left right',
          flipButtons: true,
          equalWeightButtons: true
      }
  },

  language: {
      default: 'en',
      translations: {
          en: {
              consentModal: {
                  title: 'Choose your cookies',
                  description: 'Cookies help us to enhance your experience and improve our website.',
                  acceptAllBtn: 'Accept all',
                  acceptNecessaryBtn: 'Reject all',
                  showPreferencesBtn: 'Manage Individual preferences'
              },
              preferencesModal: {
                  title: 'Manage cookie preferences',
                  acceptAllBtn: 'Accept all',
                  acceptNecessaryBtn: 'Reject all',
                  savePreferencesBtn: 'Accept current selection',
                  closeIconLabel: 'Close modal',
                  sections: [
                      {
                          title: 'Strictly Necessary cookies',
                          description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                          linkedCategory: 'necessary'
                      },
                      {
                          title: 'Performance and Analytics',
                          description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you. This includes Google analytics cookies.',
                          linkedCategory: 'analytics'
                      },
                  ]
              }
          }
        }
      },
      onConsent: function(){
        if(acceptedCategory('analytics')){
          bootstrap().then((gtag) => {
            console.log('Google Analytics is ready to use')
          })
        }
    }
};

export default cookieConsentConfig;
