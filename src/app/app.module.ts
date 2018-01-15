import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
// import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { AdaRecoveryPhraseVerifyModalPage } from '../pages/ada-recovery-phrase-verify-modal/ada-recovery-phrase-verify-modal';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

// crypto pages
import { AdaPage } from '../pages/ada/ada';
import { AdaSettingsPage } from '../pages/ada-settings/ada-settings';
import { AdaTradePage } from '../pages/ada-trade/ada-trade';
import { AdaTransactionsPage } from '../pages/ada-transactions/ada-transactions';
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { PricesPage } from '../pages/prices/prices';
import { AdaRecoverWalletModalPage } from '../pages/ada-recover-wallet-modal/ada-recover-wallet-modal';
import { AdaSendPage } from '../pages/ada-send/ada-send';
import { AdaReceivePage } from '../pages/ada-receive/ada-receive';
import { AdaConfirmTransactionPage } from '../pages/ada-confirm-transaction/ada-confirm-transaction';

// crypto providers 
import { BtcProvider } from '../providers/btc/btc';
import { CryptoCompareProvider } from '../providers/crypto-compare/crypto-compare';
import { CoinMarketCapProvider } from '../providers/coin-market-cap/coin-market-cap';
import { PipesModule } from '../pipes/pipes.module';
import { CoinIconsProvider } from '../providers/coin-icons/coin-icons';
import { AdaProvider } from '../providers/ada/ada';


@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    // SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    AdaPage,
    AdaTradePage,
    AdaTransactionsPage,
    AdaSettingsPage,
    PortfolioPage,
    PricesPage,
    AdaRecoveryPhraseVerifyModalPage,
    AdaRecoverWalletModalPage,
    AdaSendPage,
    AdaReceivePage,
    AdaConfirmTransactionPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    PipesModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        // { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:sessionId' },
        { component: ScheduleFilterPage, name: 'ScheduleFilter', segment: 'scheduleFilter' },
        { component: SpeakerListPage, name: 'SpeakerList', segment: 'speakerList' },
        { component: SpeakerDetailPage, name: 'SpeakerDetail', segment: 'speakerDetail/:speakerId' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: PortfolioPage, name: 'PortfolioPage', segment: 'portfolio-page' },
        { component: AdaPage, name: 'AdaPage', segment: 'ada-page' },
        { component: AdaTradePage, name: 'AdaTradePage', segment: 'ada-trade-page' },
        { component: AdaTransactionsPage, name: 'AdaTransactionsPage', segment: 'ada-transavtions-page' },
        { component: AdaSettingsPage, name: 'AdaSettingsPage', segment: 'ada-settings-page' },
        { component: PricesPage, name: 'PricesPage', segment: 'prices-page' },
        { component: MapPage, name: 'MapPage', segment: 'map-page' },
        { component: AdaRecoveryPhraseVerifyModalPage, name: 'AdaRecoveryPhraseVerifyModalPage', segment: 'ada-recovery-phrase-verify-modal-page' },
        { component: AdaRecoverWalletModalPage, name: 'AdaRecoverWalletModalPage', segment: 'ada-recover-wallet-modal-page' },
        { component: AdaSendPage, name: 'AdaSendPage', segment: 'ada-send-page' },
        { component: AdaReceivePage, name: 'AdaReceivePage', segment: 'ada-receive-page' },
        { component: AdaConfirmTransactionPage, name: 'AdaConfirmTransactionPage', segment: 'ada-confirm-transaction-page' },
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    // SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    AdaPage,
    AdaTradePage,
    AdaTransactionsPage,
    AdaSettingsPage,
    PortfolioPage,
    PricesPage,
    AdaRecoveryPhraseVerifyModalPage,
    AdaRecoverWalletModalPage,
    AdaSendPage,
    AdaReceivePage,
    AdaConfirmTransactionPage,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    UserData,
    InAppBrowser,
    SplashScreen,
    BtcProvider,
    CryptoCompareProvider,
    CoinMarketCapProvider,
    CoinIconsProvider,
    AdaProvider,
    AdaRecoverWalletModalPage,
    AdaSendPage,
    AdaReceivePage,
  ]
})
export class AppModule { }
