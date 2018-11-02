import { Component,Input } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { NavController } from 'ionic-angular';
import { WeblinkProvider } from '../../providers/weblink/weblink';
@Component({
  selector: 'ion-modle-d',
  templateUrl: 'ion-modle-d.html'
})
export class IonModleDComponent {
  @Input() params:(any);
  public img1 = "";
  public img2 = "";
  public img3 = "";
  public title = "";
  public sort: number;
  public picType1 :(number);
  public picProductid1:(number);
  public picKeyword1:(string);
  public picUrl1:(string);
  public picType2 :(number);
  public picProductid2:(number);
  public picKeyword2:(string);
  public picUrl2:(string);
  public picType3 :(number);
  public picProductid3:(number);
  public picKeyword3:(string);
  public picUrl3:(string);
  constructor(public navCtrl:NavController,public config :ConfigProvider,public web: WeblinkProvider) {
   
  }
  goDetail1(){
    if(this.picType1==1){
      this.web.goWeb(this.picUrl1);
    }else if(this.picType1==2){
      this.navCtrl.push("ProductDetailPage",{
        "id":this.picProductid1
      });
    }else if(this.picType1==3){
      this.navCtrl.push("KeyProductListPage",{
        "keywords":this.picKeyword1
      });
    }
  }
  goDetail2(){
    if(this.picType2==1){
      this.web.goWeb(this.picUrl2);
    }else if(this.picType2==2){
      this.navCtrl.push("ProductDetailPage",{
        "id":this.picProductid2
      });
    }else if(this.picType2==3){
      this.navCtrl.push("KeyProductListPage",{
        "keywords":this.picKeyword2
      });
    }
  }
  goDetail3(){
    if(this.picType3==1){
      this.web.goWeb(this.picUrl3);
    }else if(this.picType3==2){
      this.navCtrl.push("ProductDetailPage",{
        "id":this.picProductid3
      });
    }else if(this.picType3==3){
      this.navCtrl.push("KeyProductListPage",{
        "keywords":this.picKeyword3
      });
    }
  }
  ngOnChanges(){
    if(this.params.pageMoudles!=null){
      this.picProductid1 = this.params.pageMoudles[0].picProductid;
      this.img1 = this.params.pageMoudles[0].pic;
      this.picType1= this.params.pageMoudles[0].picType;
      this.picKeyword1 = this.params.pageMoudles[0].picKeyword;
      this.picUrl1 = this.params.pageMoudles[0].picUrl;
      this.picProductid2 = this.params.pageMoudles[1].picProductid;
      this.img2 = this.params.pageMoudles[1].pic;
      this.picType2= this.params.pageMoudles[1].picType;
      this.picKeyword2 = this.params.pageMoudles[1].picKeyword;
      this.picUrl2 = this.params.pageMoudles[1].picUrl;
      this.picProductid3 = this.params.pageMoudles[2].picProductid;
      this.img3 = this.params.pageMoudles[2].pic;
      this.picType3= this.params.pageMoudles[2].picType;
      this.picKeyword3 = this.params.pageMoudles[2].picKeyword;
      this.picUrl3 = this.params.pageMoudles[2].picUrl;
      this.title = this.params.title;
      this.sort = this.params.sort;
    }
    if(this.title==''){
      let titleDom = document.querySelectorAll(".dis");
      if(this.sort!=undefined){
        let titleDom1 = titleDom[this.sort-2].querySelectorAll(".style1");
        titleDom1[3]['style'].display = "none";
      }
    }
  }
}
