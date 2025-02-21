

// 機能名：天気予報通知

/*
 * 定義名：天気アイコンに対応するSlackの絵文字コードの定義
 * 説明：
 * この定義は列挙型といってキーと値で構成する設定値です。
 * 天気予報データの天気アイコンを「キー」として、Slackの絵文字コードを「値」として定義する。
 * 定義の１行目に"01d"というキーに、":sunny:"という値を設定しています。
 * 使用例は以下のようになります。
 * code = enumWeather["01d"];
 * codeの値は":sunny:"が設定されることになります。
 */

const enumWeather = {
  "01d": ":sunny:", // 快晴（日中）
  "01n": ":first_quarter_moon_with_face:", // 快晴（夜）
  "02d": ":barely_sunny:", // 晴れ（日中）
  "02n": ":first_quarter_moon_with_cloud:", // 晴れ（夜）
  "03d": ":partly_sunny:", // くもり（日中）
  "03n": ":partly_sunny:", // くもり（夜）
  "04d": ":cloud:", // くもり（日中）
  "04n": ":cloud:", // くもり（夜）
  "09d": ":cloud_with_rain:", // 小雨（日中）
  "09n": ":cloud_with_rain:", // 小雨（夜）
  "10d": ":cloud_with_rain:", // 雨（日中）
  "10n": ":cloud_with_rain:", // 雨（夜）
  "11d": ":thunder_cloud_and_rain:", // 雷雨（日中）
  "11n": ":thunder_cloud_and_rain:", // 雷雨（夜）
  "13d": ":cloud_with_snow:", // 雪（日中）
  "13n": ":cloud_with_snow:", // 雪（夜）
  "50d": ":fog:", // 霧（日中）
  "50n": ":fog:", // 霧（夜）
};

//
function setDocumentPropertiesFromSpreadsheet() {
  // スプレッドシートを取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // データの範囲を取得
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();

  // DocumentProperties サービスを取得
  var docProperties = PropertiesService.getDocumentProperties();

  // スプレッドシートの各行を処理
  for (var i = 1; i < data.length; i++) {
    var key = data[i][1];  // A列のキー
    var value = data[i][2];  // B列の値

    // DocumentProperty を設定
    docProperties.setProperty(key, value);
  }


}



/*
 * 関数名：天気予報通知処理
 * 説明：この処理から開始します。
 */
function NotifyWeatherForecastTokyo() {
  // 天気予報データ取得処理
  var data = getTokyoWeather();
  if (data == null) {
    // dataに値が設定されていない(null)場合、実行ログに出力する。
    Logger.log('天気予報データ取得処理でエラーが発生したため処理を終了します。');
    // 処理を終了する。
    return;
  }

  // 時間変換処理
  var wkDate = ChangeTimeStampToDate(data['dt']);
  if (wkDate == null) {
    // wkDateに値が設定されていない(null)場合、実行ログに出力する。
    Logger.log('時間変換処理でエラーが発生したため処理を終了します');
    // 処理を終了する。
    return;
  }

  // 詳細
  var description = data['weather'][0]['description'];
  // アイコン
  var icon = data['weather'][0]['icon'];
  // 気温
  var temp = data['main']['temp'];
  // 最高気温
  var main_temp_max = data['main']['temp_max'];
  // 最低気温
  var main_temp_min = data['main']['temp_min'];
  // 湿度
  var humidity = data['main']['humidity'];

  // slackに送信するメッセージを設定する。
  var payload = {
    'text': "東京の天気" + "\n" +
      "(" + wkDate + ")" + "\n" + "\n" +
      enumWeather[icon] + "\n" +
      description + "\n" +
      "気温：" + temp.toFixed(1) + "°C" + "\n" +
      "最高気温：" + main_temp_max.toFixed(1) + "°C" + "\n" +
      "最低気温：" + main_temp_min.toFixed(1) + "°C" + "\n" +
      "湿度：" + humidity + "％" + "\n"
  };

  // UrlFetchApp.fetch処理で使用するパラメータ(payload等)を設定する。
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
  };

  // SlackのIncoming Webhookで作成したURLを設定する
  var posturl = PropertiesService.getScriptProperties().getProperty('SlackAPIUrl');
  // UrlFetchAppサービス（HTTP通信）のfetch処理にposturlとoptionsを設定して、Slackに送信する。
  UrlFetchApp.fetch(posturl, options);
  delTrigger();
}
function NotifyWeatherForecastLondon() {
  // 天気予報データ取得処理
  var data = getLondonWeather();
  if (data == null) {
    // dataに値が設定されていない(null)場合、実行ログに出力する。
    Logger.log('天気予報データ取得処理でエラーが発生したため処理を終了します。');
    // 処理を終了する。
    return;
  }

  // 時間変換処理
  var wkDate = ChangeTimeStampToDate(data['dt']);
  if (wkDate == null) {
    // wkDateに値が設定されていない(null)場合、実行ログに出力する。
    Logger.log('時間変換処理でエラーが発生したため処理を終了します');
    // 処理を終了する。
    return;
  }

  // 詳細
  var description = data['weather'][0]['description'];
  // アイコン
  var icon = data['weather'][0]['icon'];
  // 気温
  var temp = data['main']['temp'];
  // 最高気温
  var main_temp_max = data['main']['temp_max'];
  // 最低気温
  var main_temp_min = data['main']['temp_min'];
  // 湿度
  var humidity = data['main']['humidity'];

  // slackに送信するメッセージを設定する。
  var payload = {
    'text': "ロンドンの天気" + "\n" +
      "(" + wkDate + ")" + "\n" + "\n" +
      enumWeather[icon] + "\n" +
      description + "\n" +
      "気温：" + temp.toFixed(1) + "°C" + "\n" +
      "最高気温：" + main_temp_max.toFixed(1) + "°C" + "\n" +
      "最低気温：" + main_temp_min.toFixed(1) + "°C" + "\n" +
      "湿度：" + humidity + "％" + "\n"
  };

  // UrlFetchApp.fetch処理で使用するパラメータ(payload等)を設定する。
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
  };

  // SlackのIncoming Webhookで作成したURLを設定する
  var posturl = PropertiesService.getScriptProperties().getProperty('SlackAPIUrl');
  // UrlFetchAppサービス（HTTP通信）のfetch処理にposturlとoptionsを設定して、Slackに送信する。
  UrlFetchApp.fetch(posturl, options);
  delTrigger();
}
function NotifyWeatherForecastPhonix() {
  // 天気予報データ取得処理
  var data = getPhoenixWeather();
  if (data == null) {
    // dataに値が設定されていない(null)場合、実行ログに出力する。
    Logger.log('天気予報データ取得処理でエラーが発生したため処理を終了します。');
    // 処理を終了する。
    return;
  }

  // 時間変換処理
  var wkDate = ChangeTimeStampToDate(data['dt']);
  if (wkDate == null) {
    // wkDateに値が設定されていない(null)場合、実行ログに出力する。
    Logger.log('時間変換処理でエラーが発生したため処理を終了します');
    // 処理を終了する。
    return;
  }

  // 詳細
  var description = data['weather'][0]['description'];
  // アイコン
  var icon = data['weather'][0]['icon'];
  // 気温
  var temp = data['main']['temp'];
  // 最高気温
  var main_temp_max = data['main']['temp_max'];
  // 最低気温
  var main_temp_min = data['main']['temp_min'];
  // 湿度
  var humidity = data['main']['humidity'];

  // slackに送信するメッセージを設定する。
  var payload = {
    'text': "Phoenixの天気" + "\n" +
      "(" + wkDate + ")" + "\n" + "\n" +
      enumWeather[icon] + "\n" +
      description + "\n" +
      "気温：" + temp.toFixed(1) + "°C" + "\n" +
      "最高気温：" + main_temp_max.toFixed(1) + "°C" + "\n" +
      "最低気温：" + main_temp_min.toFixed(1) + "°C" + "\n" +
      "湿度：" + humidity + "％" + "\n"
  };

  // UrlFetchApp.fetch処理で使用するパラメータ(payload等)を設定する。
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
  };

  // SlackのIncoming Webhookで作成したURLを設定する
  var posturl = PropertiesService.getScriptProperties().getProperty('SlackAPIUrl');
  // UrlFetchAppサービス（HTTP通信）のfetch処理にposturlとoptionsを設定して、Slackに送信する。
  UrlFetchApp.fetch(posturl, options);
  delTrigger();
}

/*
 * 関数名：天気予報データ取得処理
 * 説明：天気予報APIを実行して東京の天気予報データを取得する。
 * 引数：なし
 * 戻り値：JSON解析した天気予報のデータ
 * エラー時はメッセージを実行ログに出力する。
 */
function getTokyoWeather() {
  try {
    // 指定されたAPI Keyを設定する
    var apikey = PropertiesService.getScriptProperties().getProperty('OpenweatherApiKey');
    var url = PropertiesService.getDocumentProperties().getProperty('東京都') + apikey;


    // UrlFetchAppサービス（HTTP通信）のfetch処理にurlを設定して、天気予報データを取得する。
    var data = UrlFetchApp.fetch(url);

    // 戻り値にJSON解析した天気予報のデータを設定する。
    return JSON.parse(data.getContentText());

  } catch (e) {
    Logger.log(e.message);
  }
}

function getLondonWeather() {
  try {
    // 指定されたAPI Keyを設定する
    var apikey = PropertiesService.getScriptProperties().getProperty('OpenweatherApiKey');
    var url = PropertiesService.getDocumentProperties().getProperty('ロンドン') + apikey;


    // UrlFetchAppサービス（HTTP通信）のfetch処理にurlを設定して、天気予報データを取得する。
    var data = UrlFetchApp.fetch(url);

    // 戻り値にJSON解析した天気予報のデータを設定する。
    return JSON.parse(data.getContentText());

  } catch (e) {
    Logger.log(e.message);
  }
}

function getPhoenixWeather() {
  try {
    // 指定されたAPI Keyを設定する
    var apikey = PropertiesService.getScriptProperties().getProperty('OpenweatherApiKey');
    var url = PropertiesService.getDocumentProperties().getProperty('Phoenix') + apikey;


    // UrlFetchAppサービス（HTTP通信）のfetch処理にurlを設定して、天気予報データを取得する。
    var data = UrlFetchApp.fetch(url);

    // 戻り値にJSON解析した天気予報のデータを設定する。
    return JSON.parse(data.getContentText());

  } catch (e) {
    Logger.log(e.message);
  }
}

/*
 * 関数名：時間変換処理（タイムスタンプ　⇒　年月日時変換）
 * 説明：天気予報APIのTimeStampからDateに変換して年、月、日、時間を取得する。
 * 引数：天気予報APIのTimeStamp
 * 戻り値：「〇年〇月〇日〇時分現在」に編集したデータ
 * エラー時はメッセージを実行ログに出力する。
 */
function ChangeTimeStampToDate(dt) {
  try {
    // 天気予報APIのTimeStampをDate型（日付）の時間に変換する。
    var d = new Date(dt * 1000);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
    var min = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();

    // 戻り値に年月日時分現在の文字列に編集したデータを設定する。
    return year + "年" + month + "月" + day + "日" + hour + "時" + min + "分現在";

  } catch (e) {
    Logger.log(e.message);
  }
}

/*
 * 関数名：setTrigger
 * 説明：実行した日の12:30に NotifyWeatherForecastTokyo を実行する 。
 */
function setTrigger() {
  const time = new Date();
  time.setHours(12);
  time.setMinutes(30);
  ScriptApp.newTrigger('NotifyWeatherForecastTokyo').timeBased().at(time).create();
}

/*
 * 関数名：delTrigger
 * 説明：不要なトリガーを削除する
 */
function delTrigger() {

  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() == "NotifyWeatherForecastTokyo") {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

function added_problem() {
  // スプレッドシートを取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // データの範囲を取得
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  for (var i = 1; i < data.length; i++) {
    checked = data[i][0];

    if (checked) {
      if (i === 1) {
        NotifyWeatherForecastTokyo()

      }
      if (i === 2) {
        // 天気予報データ取得処理
       NotifyWeatherForecastLondon()
        
      }
      if (i === 3) {
        // 天気予報データ取得処理
       NotifyWeatherForecastPhonix()
      }


    }
  }
}









