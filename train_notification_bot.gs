// 機能名：電車情報通知

/*
 * 関数名：電車情報通知処理
 * 説明：この処理から開始します。
 */
function TrainInfoNotification(){

   //Yahoo路線情報のURLを設定する。
   var url = "YahooAPI";
   // UrlFetchAppサービス（HTTP通信）のfetch処理にurlを設定して、Yahoo路線情報を取得する。
   var contents = UrlFetchApp.fetch(url).getContentText();
   
   // 更新時刻部分が取れるように正規表現（文字をひとつの形式で表現する方法）を設定する。
   var myRegexp = /<span class="subText">([\s\S]*?)</i;

   // 文字列検索するexec処理を利用し、路線情報から更新時刻を抽出してtimeに設定する。
   // もしexec処理の結果null以外の場合、取得した更新時刻データを設定し、nullの場合は空値(["",""])を設定する。
   var time = (myRegexp.exec(contents) != null) ? myRegexp.exec(contents) : ["",""]; 

   // 路線部分が取れるように正規表現（文字をひとつの形式で表現する方法）を設定する。
   var myRegexp = /<div class="elmTblLstLine trouble">([\s\S]*?)<\/div>/i;
   // 運行情報がある路線部分の情報をざっくりと抽出する。
   var regexp = myRegexp.exec(contents);
   
   // もし、路線部分の情報が取得できた場合
   if(regexp != null){
     var result = [];
     var regexp2 = [];
     
     // 路線情報が取れるように正規表現（文字をひとつの形式で表現する方法）を設定する。
     var myRegexp2 = /">([\s\S]*?)</g;

     // 路線情報データをひとつずつ取り出してregexp2に設定することを繰り返す。
     // null（データの取得が終わるまで）になったら終了する。　
     while((regexp2 = myRegexp2.exec(regexp[0])) != null){
       // もし、遅延情報（[!]）のデータがある、かつ、データが空白ではない場合
       if(regexp2[1] != "[!]" && regexp2[1] != ""){
         // 路線別の運行情報詳細を取得して配列にデータを追加する。
         result.push(regexp2[1]);
       }
     }
   }
   
   // もし配列にデータがある場合
   if(result.length != 0){
     // 運行情報の件数をカウントする
     var counts = result.length / 2;
   
     var postdata = "";
     for(i = 0; i < counts ; i++){
         // 運行情報を表示用に整えて変数に設定する
         postdata += result[i*2] + ":" + result[i*2+1] + "\n";
     }
   }else{
     // 配列にデータがない場合は、メッセージを設定する。
     var postdata = ":train:運行情報はありません";
   }
  
   // slackに送信するメッセージを設定する。
   var payload = {
     'text' : " :train:Yahoo!路線情報:train:" + "\n" + "\n``` " +
               postdata + "```\n" + "\n" +
               time[1] + "\n" +
               "https://transit.yahoo.co.jp/diainfo/area/4"
   };
      
   // UrlFetchApp.fetch処理で使用するパラメータ(payload等)を設定する。
   var options = {
     'method' : 'post',
     'contentType' : 'application/json',
     'payload' : JSON.stringify(payload),
   };
   
   // SlackのIncoming Webhookで作成したURLを設定する
   var posturl = 'SlackAPI';
   
   // UrlFetchAppサービス（HTTP通信）のfetch処理にposturlとoptionsを設定して、Slackに送信する。
   UrlFetchApp.fetch(posturl,options);
   
}