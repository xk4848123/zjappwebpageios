import { Component,Input } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { NavController } from 'ionic-angular';
import { WeblinkProvider } from '../../providers/weblink/weblink';
@Component({
  selector: 'ion-modle-a',
  templateUrl: 'ion-modle-a.html'
})
export class IonModleAComponent {
  @Input() params: (any);
  public title = "";
  public img = "";
  public sort:number;
  public picType :(number);
  public picProductid:(number);
  public picKeyword:(string);
  public picUrl:(string);
  constructor(public navCtrl:NavController,public config : ConfigProvider,public web: WeblinkProvider) {

  }
  /**跳转 */
  goDetail(){
    if(this.picType==1){
      this.web.goWeb(this.picUrl);
    }else if(this.picType==2){
      this.navCtrl.push("ProductDetailPage",{
        "id":this.picProductid
      });
    }else if(this.picType==3){
      this.navCtrl.push("KeyProductListPage",{
        "keywords":this.picKeyword
      });
    }
  }
  // /**参数改变 */
  ngOnChanges(){
    if(this.params.pageMoudles!=null){
      this.img = this.params.pageMoudles[0].pic;
      this.picType = this.params.pageMoudles[0].picType;
      this.picProductid = this.params.pageMoudles[0].picProductid;
      this.picKeyword = this.params.pageMoudles[0].picKeyword;
      this.picUrl = this.params.pageMoudles[0].picUrl;
      this.title = this.params.title;
      this.sort = this.params.sort;
    }
    if(this.title==''){
      let titleDom = document.querySelectorAll(".dis");
      if(this.sort!=undefined){
        let titleDom1 = titleDom[this.sort-2].querySelectorAll(".style1");
        titleDom1[0]['style'].display = "none";
      }
    }
  }
}
