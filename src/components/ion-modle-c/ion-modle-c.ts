import { Component,Input } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { NavController } from 'ionic-angular';
import { WeblinkProvider } from '../../providers/weblink/weblink';
@Component({
  selector: 'ion-modle-c',
  templateUrl: 'ion-modle-c.html'
})
export class IonModleCComponent {
  @Input() params:(any);
  public param : Array<any>;
  public title = "";
  public sort :number;
  constructor(public navCtrl:NavController,public config: ConfigProvider,public web: WeblinkProvider) {
    
  }
  goDetail(item){
    if(item.picType==1){
      this.web.goWeb(item.picUrl);
    }else if(item.picType==2){
      this.navCtrl.push("ProductDetailPage",{
        "id":item.picProductid
      });
    }else if(item.picType==3){
      this.navCtrl.push("KeyProductListPage",{
        "keywords":item.picKeyword
      });
    }
  }
  ngOnChanges(){
    if(this.params.pageMoudles!=undefined){
      this.param = this.params.pageMoudles;
      this.title = this.params.title;
      this.sort = this.params.sort;
    }
    if(this.title==''){
      let titleDom = document.querySelectorAll(".dis");
      if(this.sort!=undefined){
        let titleDom1 = titleDom[this.sort-2].querySelectorAll(".style1");
        titleDom1[2]['style'].display = "none";
      }
    }
  }
}
