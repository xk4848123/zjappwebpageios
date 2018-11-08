import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule, JsonpModule } from '@angular/http';

import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AppVersion } from '@ionic-native/app-version';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { JPush } from '@jiguang-ionic/jpush';

import { MyApp } from './app.component';
//A组件
import { IonModleAComponent } from './../components/ion-modle-a/ion-modle-a';
//B组件
import { IonModleBComponent } from './../components/ion-modle-b/ion-modle-b';
//C组件
import { IonModleCComponent } from './../components/ion-modle-c/ion-modle-c';
//D组件
import { IonModleDComponent } from './../components/ion-modle-d/ion-modle-d';
//G组件
import { IonModleGComponent } from './../components/ion-modle-g/ion-modle-g';

import { ShareComponent } from './../components/share/share';
//轮播页面
import { IndexAdvPage } from '../pages/index-adv/index-adv';
import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { CartPage } from '../pages/cart/cart';
import { UserPage } from '../pages/user/user';
//登录
import { LoginPageModule } from '../pages/login/login.module';

//搜索页面
import { SearchPageModule } from '../pages/search/search.module';


//商品列表
import { ProductlistPageModule } from '../pages/productlist/productlist.module';

//商品详情

//账户管理

import { PersonalPageModule } from '../pages/personal/personal.module';

//选择支付方式
import { PaymentPageModule } from '../pages/payment/payment.module';
//设置页面
import { SettingPageModule } from '../pages/setting/setting.module';

//我的粉丝

import { FansPageModule } from '../pages/fans/fans.module';

import { MywalletPageModule } from '../pages/mywallet/mywallet.module';

//粉丝详情
import { FandetailPageModule } from '../pages/fandetail/fandetail.module';

//全部订单
import { OrdersPageModule } from '../pages/orders/orders.module';
//申请退款
import { RefundPageModule } from '../pages/refund/refund.module';

//申请退货
import { SalereturnPageModule } from '../pages/salereturn/salereturn.module';
//查看物流
import { InformationPageModule } from '../pages/information/information.module';
//待评价
import { CommentPageModule } from '../pages/comment/comment.module';

//商学院
import { CommercialPageModule } from '../pages/commercial/commercial.module';

//课程详情
import { CommercialdetailPageModule } from '../pages/commercialdetail/commercialdetail.module';


import { OrderlistPageModule } from '../pages/orderlist/orderlist.module';

import { RechargePageModule } from '../pages/recharge/recharge.module';


import { VippresentPageModule } from '../pages/vippresent/vippresent.module';

import { VippresentdetailPageModule } from '../pages/vippresentdetail/vippresentdetail.module';
import { SetpaypasswordPageModule } from '../pages/setpaypassword/setpaypassword.module';
import { UpdatepasswordPageModule } from '../pages/updatepassword/updatepassword.module';
import { WithdrawPageModule } from '../pages/withdraw/withdraw.module';
import { WithdrawaccountPageModule } from '../pages/withdrawaccount/withdrawaccount.module';
import { AddaliacountPageModule } from '../pages/addaliacount/addaliacount.module';
import { AddbankacountPageModule } from '../pages/addbankacount/addbankacount.module';
import { MoneyrecordPageModule } from '../pages/moneyrecord/moneyrecord.module';
import { UpdaterankPageModule } from '../pages/updaterank/updaterank.module';
import { AddressPageModule } from '../pages/address/address.module';
import { OperateaddressPageModule } from '../pages/operateaddress/operateaddress.module';
import { CertificationPageModule } from '../pages/certification/certification.module';
import { ProxyapplyPageModule } from '../pages/proxyapply/proxyapply.module';
import { SplitinitPageModule } from '../pages/splitinit/splitinit.module';
import { SplitimmediatelyPageModule } from '../pages/splitimmediately/splitimmediately.module';

import { TabsPage } from '../pages/tabs/tabs';
import { ConfigProvider } from '../providers/config/config';
import { HttpServicesProvider } from '../providers/http-services/http-services';

import { StorageProvider } from '../providers/storage/storage';
import { AlertProvider } from '../providers/alert/alert';
import { ClearloginProvider } from '../providers/clearlogin/clearlogin';
import { ToastProvider } from '../providers/toast/toast';
import { RloginprocessProvider } from '../providers/rloginprocess/rloginprocess';
/**商品详情 */
import { ProductDetailPageModule } from "../pages/product-detail/product-detail.module";
import { PaysuccessPageModule } from "../pages/paysuccess/paysuccess.module";
import { ElectransferPageModule } from "../pages/electransfer/electransfer.module";
import { CallcenterPageModule } from "../pages/callcenter/callcenter.module";
import { SplitrecordPageModule } from '../pages/splitrecord/splitrecord.module';
import { SetattrPageModule } from '../pages/setattr/setattr.module';
import { UpdatephonenumPageModule } from '../pages/updatephonenum/updatephonenum.module';
import { UpdatephonenumnextPageModule } from '../pages/updatephonenumnext/updatephonenumnext.module';
import { MembersProductPageModule } from '../pages/members-product/members-product.module';
import { ConfirmVipOrderPageModule } from '../pages/confirm-vip-order/confirm-vip-order.module';
import { ProductCommentPageModule } from '../pages/product-comment/product-comment.module';
import { OrderhandletransferPageModule } from '../pages/orderhandletransfer/orderhandletransfer.module';
import { KeyProductListPageModule } from '../pages/key-product-list/key-product-list.module';
import { QrcodePageModule } from '../pages/qrcode/qrcode.module';

import { ImgProvider } from '../providers/img/img';
//组件
import { CarModalComponent } from '../components/car-modal/car-modal';
import { CarMemberComponent } from '../components/car-member/car-member';
import { ConfirmOrderPageModule } from '../pages/confirm-order/confirm-order.module';
import { WeblinkProvider } from '../providers/weblink/weblink';
import { VerifypasswordProvider } from '../providers/verifypassword/verifypassword';
import { AddressmodelComponent } from '../components/addressmodel/addressmodel';
import { JpushProvider } from '../providers/jpush/jpush';
import { AppshareProvider } from '../providers/appshare/appshare';
import { AppUpdateProvider } from '../providers/app-update/app-update';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    IndexAdvPage,
    IonModleAComponent,
    IonModleBComponent,
    IonModleCComponent,
    IonModleDComponent,
    IonModleGComponent,
    CarModalComponent,
    CarMemberComponent,
    HomePage,
    CategoryPage,
    CartPage,
    UserPage,
    AddressmodelComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    HttpModule, JsonpModule,
    ProductDetailPageModule,
    LoginPageModule,
    SearchPageModule,
    ProductlistPageModule,
    PersonalPageModule,
    PaymentPageModule,
    SettingPageModule,
    FansPageModule,
    MywalletPageModule,
    FandetailPageModule,
    OrdersPageModule,
    RechargePageModule,
    VippresentPageModule,
    VippresentdetailPageModule,
    SetpaypasswordPageModule,
    UpdatepasswordPageModule,
    WithdrawPageModule,
    WithdrawaccountPageModule,
    AddaliacountPageModule,
    AddbankacountPageModule,
    OrderlistPageModule,
    RefundPageModule,
    SalereturnPageModule,
    InformationPageModule,
    CommentPageModule,
    CommercialPageModule,
    CommercialdetailPageModule,
    ConfirmOrderPageModule,
    PaysuccessPageModule,
    MoneyrecordPageModule,
    ElectransferPageModule,
    UpdaterankPageModule,
    CallcenterPageModule,
    AddressPageModule,
    OperateaddressPageModule,
    CertificationPageModule,
    ProxyapplyPageModule,
    SplitinitPageModule,
    SplitrecordPageModule,
    SplitimmediatelyPageModule,
    SetattrPageModule,
    UpdatephonenumPageModule,
    UpdatephonenumnextPageModule,
    MembersProductPageModule,
    ConfirmVipOrderPageModule,
    ProductCommentPageModule,
    OrderhandletransferPageModule,
    KeyProductListPageModule,
    QrcodePageModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      tabsHideOnSubPages: 'true', //隐藏全部子页面 tabs
      backButtonText: '', /*配置返回按钮*/
      iconMode: 'ios'
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    IndexAdvPage,
    IonModleAComponent,
    IonModleBComponent,
    IonModleCComponent,
    IonModleDComponent,
    IonModleGComponent,
    CarModalComponent,
    CarMemberComponent,
    HomePage,
    CategoryPage,
    CartPage,
    UserPage,
    AddressmodelComponent,
    ShareComponent
  ],
  providers: [  /*引入了自定义的服务*/
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConfigProvider,
    HttpServicesProvider,
    StorageProvider,
    ImgProvider,
    Camera,
    JPush,
    Device,
    ImagePicker,
    AppVersion,
    FileTransferObject,
    FileOpener,
    FileTransfer,
    AlertProvider,
    ClearloginProvider,
    ToastProvider,
    RloginprocessProvider,
    WeblinkProvider,
    VerifypasswordProvider,
    JpushProvider,
    AppshareProvider,
    AppUpdateProvider
  ]
})
export class AppModule {
 }
