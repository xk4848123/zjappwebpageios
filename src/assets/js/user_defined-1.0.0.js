
var global_wxFunciton = new Object(); //创建对象
/**创建二维码 */
function createCard(element,height,width,content){
  var qrcode = new QRCode(element,{
    width:width,
    height:height,
  });
  qrcode.makeCode(content);
}
global_wxFunciton.global_createCard = createCard;