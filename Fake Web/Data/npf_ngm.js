function _CustomScheme() {
  function SafeRegisterEvent( target, eventType, cb ) {
    if ( target.addEventListener ) {
      target.addEventListener( eventType, cb );
      return {
        remove: function () {
          target.removeEventListener( eventType, cb );
        }
      };
    }
    else {
      target.attachEvent( eventType, cb );
      return {
        remove: function () {
          target.detachEvent( eventType, cb );
        }
      };
    }
  }

  function CreateHiddenIframe( target, uri ) {
    var iframe = document.createElement( "iframe" );
    iframe.src = uri;
    iframe.id = "hiddenIframe";
    iframe.style.display = "none";
    target.appendChild( iframe );

    return iframe;
  }

  this.CheckBrowser = function () {
    var isOpera = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;
    return {
      isOpera   : isOpera,
      isFirefox : typeof InstallTrigger !== 'undefined',
      isSafari  : Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0,
      isChrome  : !!window.chrome && !isOpera,
      isIE      : /*@cc_on!@*/false || !!document.documentMode, // At least IE6
      isEdge    : navigator.userAgent.toLowerCase().indexOf('edge') > -1
    }
  };

  this.IsSupportedBrowser = function () {
    var browser = this.CheckBrowser();
    if (browser.isFirefox || browser.isChrome || browser.isOpera) {
      return true;
    } else if (browser.isIE && document.documentMode != null) {
      var availableMinDocumentMode = 9;
      return document.documentMode >= availableMinDocumentMode;
    }

    return false;
  }

  this.OpenUriWithHiddenFrameWithoutBlur = function ( uri, successCb, failCb ) {
    var iframe = document.querySelector( "#hiddenIframe" );
    if ( !iframe ) {
      iframe = CreateHiddenIframe( document.body, "about:blank" );
    }

    try {
      iframe.contentWindow.location.href = uri;
      successCb();
    } catch ( e ) {
      failCb();
    }
  };

  this.OpenUriWithoutBlur = function (uri, successCb, failCb) {
    var browser = this.CheckBrowser();
    if (navigator.msLaunchUri && browser.isIE) { //for IE in Win 8 and Win 10
      navigator.msLaunchUri(uri, successCb, failCb);
    } else {
      CustomScheme.OpenUriWithHiddenFrameWithoutBlur(uri, successCb, failCb);
    }

    return true;
  }
};

var CustomScheme = new _CustomScheme();

function _NGM()
{
  this.strGameAXName    = "NXCOM.NxGameControl.2";
  this.strGameFPName    = "application/x-npnxgame";
  this.objNxGame      = null;
  this.versionNxGame    = 0;

  this.strNxMInfoAXName = "NXCOM.NxMachineControl.2";
  this.strNxMInfoFPName = "application/x-npnxminfo";
  this.objNxMInfo     = null;
  this.versionNxMInfo   = 0;

  if ( window.navigator.userAgent.indexOf("x64") > -1 )
  {
    this.strGameAXName    = "NXCOM.NxGameControl.2.x64";
    this.strNxMInfoAXName = "NXCOM.NxMachineControl.2.x64";
  }

  // Deprecated by remove ActiveX. but, keeping for legacy module update. - 2018.02.06
  this.strServerHost    = "platform.nexon.com/NGM/Bin/NGMDll.dll";
  this.strNGMDllCRC   = "1";
  this.strGameDatas   = "";
  // Deprecated

  this.strInstallPage = "http://platform.nexon.com/ngm/html/pop_ngm_agreement.html";

  // Browser Info Setting
  if ( window.navigator.userAgent.toLowerCase().indexOf('edge') > -1 && navigator.msLaunchUri != undefined )
  {
    this.BrowserInfo= "Edge";
  }
  else if ( (window.navigator.appName == "Microsoft Internet Explorer") || ( window.navigator.userAgent.toLowerCase().indexOf('trident') > -1 ) )
  {
    this.BrowserInfo= "IE";
  }
  else if (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
  {
    this.BrowserInfo= "FF";
  }
  else if (window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
  {
    this.BrowserInfo= "Chrome";
  }
  else if (window.navigator.userAgent.toLowerCase().indexOf('opera') > -1)
  {
    this.BrowserInfo= "Opera";
  }
  else if (window.navigator.userAgent.toLowerCase().indexOf('safari') > -1)
  {
    this.BrowserInfo= "Safari";
  }
  else if (window.navigator.userAgent.toLowerCase().indexOf('netscape') > -1)
  {
    this.BrowserInfo= "Netscape";
  }
  else
  {
    this.BrowserInfo= "Unknown";
  }
  
  if ( this.BrowserInfo == "IE" )
  {
    this.ModuleFormat= "AX";
  }
  else if (  this.BrowserInfo == "Unknown")
  {
    this.ModuleFormat= "err";
  }
  else
  {
    this.ModuleFormat= "NP";
  }

  ImportModule({
    src: document.location.protocol + "//js.nexon.com/s1/p2/ngm-layer.min.js",
    name: "NgmRunLayer",
    complete: function(m) {
    }
  });

  this.ErrorHandler = function NGM_ErrorHandler()
  {
    if (window.navigator.userAgent.match(/iPhone|iPod|iPad|Android/) != null)
    {
      alert("모바일 환경에서는 PC 게임 실행을 지원하지 않습니다.");
    }
    else
    {
      NGM.OpenInstallAgreement("http://platform.nexon.com/NGM/Bin/Setup.exe");

      if ( typeof( nxPlayLoger ) == "function" ) nxPlayLoger( "NGMError" );
    }
  };

  this.CreateNpObject = function NGM_CreateNpObject( strPluginId, strPluginName )
  {
    navigator.plugins.refresh( false );

    var mimetype = navigator.mimeTypes[ strPluginName ];

    if ( mimetype && mimetype.enabledPlugin )
    {
      var embed   = document.createElement( 'embed' );

      embed.id    = strPluginId;
      embed.type    = strPluginName;
      embed.pluginspage = this.strInstallPage;
      embed.style.visiblity = "hidden";
      embed.style.height    = "0px";
      embed.style.width   = "0px";

      var body = document.getElementsByTagName( 'body' );

      if ( body != null && body != "undefined" )
        body[0].appendChild( embed );
    }

    return document.getElementById( strPluginId );
  };

  this.InitGameControl = function NGM_InitGameControl()
  {
    if( this.objNxGame == null )
    {
      try
      {
        if ( this.ModuleFormat == "AX" )
        {
          this.objNxGame = new ActiveXObject( this.strGameAXName );
        }
        else if ( this.ModuleFormat == "NP" )
        {
          this.objNxGame = this.CreateNpObject( 'npnxgame', this.strGameFPName );
        }
      }
      catch( ex )
      {
      }

      if ( this.objNxGame != null )
      {
        this.objNxGame.ServerHost = this.strServerHost;
        this.objNxGame.NGMDllCRC  = this.strNGMDllCRC;
        this.objNxGame.GameDatas  = this.strGameDatas;

        try
        {
          this.versionNxGame = this.objNxGame.GetVersion();
        }
        catch ( ex )
        {
          this.versionNxGame = 1.0;
        }
      }
    }
  };

  this.InitMachineControl = function NGM_InitMachineControl()
  {
    if( this.objNxMInfo == null )
    {
      try
      {
        if ( this.ModuleFormat== "AX" )
        {
          this.objNxMInfo = new ActiveXObject( this.strNxMInfoAXName );
        }
        else if ( this.ModuleFormat == "NP" )
        {
          this.objNxMInfo = this.CreateNpObject( 'npnxminfo', this.strNxMInfoFPName );
        }
      }
      catch( ex )
      {
      }

      if ( this.objNxMInfo != null )
      {
        try
        {
          this.versionNxMInfo = this.objNxMInfo.GetVersion();
        }
        catch ( ex )
        {
        }
      }
    }
  };

  this.GenerateMID = function NGM_GenerateMID()
  {
    this.InitMachineControl();

    try
    {
      var mid = this.objNxMInfo.GenerateMID();

      if ( mid == '')
      {
        if ( this.versionNxMInfo >= 1.1 )
        {
          alert( "고객님의 PC 환경에서는 지정PC 이용이 불가능합니다." );
        }
        else
        {
          this.ErrorHandler();
        }
      }
      
      return mid;
    }
    catch( ex )
    {
      if ( this.CheckPluginUnsupportBrowser() )
      {
        alert("현재 사용 중인 브라우저에서는\r\n지정PC 서비스 이용이 불가능합니다.\r\n인터넷 익스플로어를 이용해 주시기 바랍니다.");
      }
      else
      {
        this.ErrorHandler();
      }
    }
    return '';
  };

  this.GetComputerName = function GetComputerName()
  {
    this.InitMachineControl();
    
    try
    {
      var name = this.objNxMInfo.GetPCName();

      return name;
    }
    catch( ex )
    {
      if ( this.CheckPluginUnsupportBrowser() )
      {
        alert("현재 사용 중인 브라우저에서는\r\n지정PC 서비스 이용이 불가능합니다.\r\n인터넷 익스플로어를 이용해 주시기 바랍니다.");
      }
      else
      {
        this.ErrorHandler();
      }
    }
    return '';
  };

  this.IsNGMInstalled = function NGM_IsNGMInstalled()
  {
    this.InitGameControl();

    if( this.objNxGame == null )
    {
      return 0;
    }
    else
    {
      return 1;
    }
  }

  this.IsInstalledGamePlugin = function NGM_IsInstalledGamePlugin()
  {
    var mimetype = navigator.mimeTypes[ this.strGameFPName ];

    if ( mimetype == undefined )
      return false;
    else
      return true;
  }

  this.IsInstalledMachinePlugin = function NGM_IsInstalledMachinePlugin()
  {
    var mimetype = navigator.mimeTypes[ this.strNxMInfoFPName ];

    if ( mimetype == undefined )
      return false;
    else
      return true;
  }

  this.IsChrome = function NGM_IsChrome()
  {
    return this.BrowserInfo == "Chrome" ? true : false;
  }

  this.GenerateArgument = function NGM_GenerateArgument( mode, game, passport, arg, age, a2sk, position, serviceCode, architecturePlatform ) 
  {
    var argument = "-dll:" + this.strServerHost + ":" + this.strNGMDllCRC + " -locale:KR -mode:" + mode + " -game:" + game + ":0 -token:'" + passport + "' -passarg:'" + arg + "'" + " -timestamp:" + new Date().getTime();

    if ( age != null && age != "" && age != "undefined" ) 
    {
      argument += " -age:" + age;
    }

    if ( a2sk != null && a2sk != "" && a2sk != "undefined") 
    {
      argument += " -a2sk:'" + a2sk + "'";
    }

    if ( position == null || position == "" || position == "undefined")
    {
      position = "GameWeb|" + location.href;
    }

    if ( position.length > 100 )
    {
      position = position.substr(0,100);
    }

    argument += " -position:'" + position + "'";

    if ( serviceCode != null && serviceCode != "" && serviceCode != "undefined" ) 
    {
        argument += " -service:" + serviceCode;
    }

    if ( architecturePlatform != null && ( architecturePlatform == "x86" || architecturePlatform == "x64" || architecturePlatform == "auto" ) )
    {
        argument += " -architectureplatform:'" + architecturePlatform + "'";
    } else {
        argument += " -architectureplatform:'none'";
    }

    return argument;
  };

  this.ExecuteNGM = function NGM_ExecuteNGM( argument, game )
  {
    if ( CustomScheme.IsSupportedBrowser() )
    {
      NGMQuery.initialize(game);
      var uri = "ngm://launch/ " + encodeURIComponent( argument );
      CustomScheme.OpenUriWithoutBlur( uri, this.SuccessCallback, this.ErrorHandler );
      return true;
    }

    try
    {
      this.ExecuteNGMByPlugin( argument );
    }
    catch ( e )
    {
      this.ErrorHandler();
    }
  }

  this.GxForceInstall = function NGM_GxForceInstall( game, arg, passport, age, position, serviceCode )
  {
    this.InitGameControl();

    var a2sk  = this.GetCookie( "A2SK" );
    var argument = this.GenerateArgument( "install", game, passport, arg, age, a2sk, position, serviceCode, null );
    
    this.ExecuteNGM(argument, game);

    if ( typeof( nxPlayLoger ) == "function" ) nxPlayLoger( "install", game );
  };
  
  this.GxLaunchGame = function NGM_GxLaunchGame( game, arg, passport, age, position, serviceCode, architecturePlatform )
  {
    this.InitGameControl();

    var a2sk  = this.GetCookie( "A2SK" );
    var argument = this.GenerateArgument( "launch", game, passport, arg, age, a2sk, position, serviceCode, architecturePlatform );
    
    this.ExecuteNGM(argument, game);

    if ( typeof( nxPlayLoger ) == "function" ) nxPlayLoger( "launch", game );
  };

  this.WriteLogHandler = function NGM_WriteLogHandler( resultObject, responseXML )
  {
  };

  this.LaunchGameForGuestUser = function NGM_LaunchGameForGuestUser( game, arg, position, architecturePlatform )
  {
    var ngp = this.GetCookie( "NGP" );
    this.GxLaunchGame( game, arg, ngp, null, position, null, architecturePlatform );
  };

  this.LaunchGame = function NGM_LaunchGame( game, arg, position, architecturePlatform )
  {
    var npp   = this.GetCookie( "NPP" );
    this.GxLaunchGame( game, arg, npp, null, position, null, architecturePlatform );
  };

  this.LaunchGame2 = function NGM_LaunchGame2( game, arg, service, architecturePlatform )
  {
    var npp   = this.GetCookie( "NPP" );
    this.GxLaunchGame( game, arg, npp, null, null, service, architecturePlatform );
  };

  this.ForceInstall = function NGM_ForceInstall( game, arg, position )
  {
    var npp   = this.GetCookie( "NPP" );
    this.GxForceInstall( game, arg, npp, null, position, null );
  };

  this.ForceInstall2 = function NGM_ForceInstall2( game, arg, service )
  {
    var npp   = this.GetCookie( "NPP" );
    this.GxForceInstall( game, arg, npp, null, null, service );
  };

  this.ManualRestore = function NGM_ManualRestore( game, arg, position, serviceCode, architecturePlatform )
  {
    this.InitGameControl();

    var npp = this.GetCookie( "NPP" );
    var a2sk = this.GetCookie( "A2SK" );
    var argument = this.GenerateArgument( "restore", game, npp, arg, null, a2sk, position, serviceCode, architecturePlatform );

    this.ExecuteNGM(argument, game);

    if ( typeof ( nxPlayLoger ) == "function" ) nxPlayLoger( "restore", game );
  };

  this.MxForceInstall = function NGM_MxForceInstall( game, arg, position )
  {
    var msenc = this.GetCookie( "MSGENC" );
    this.GxForceInstall( game, arg, msenc, null, position, null );
  };

  this.MxLaunchGame = function NGM_MxLaunchGame( game, arg1, arg2, position, architecturePlatform )
  {
    var msenc   = this.GetCookie( "MSGENC" );
    var launchtype  = String( arg1 ).toLowerCase();
    var lastworld = String( arg2 ).toLowerCase();

    if ( lastworld != null && lastworld != "" && lastworld != "undefined" )
    {
      msenc = msenc + ":" + arg2;
    }
    if ( launchtype == "gameluanching" )
    {
      msenc = "";
    }

    this.GxLaunchGame( game, arg1, msenc, null, position, null, architecturePlatform );
  };

  this.ChannelForceInstall = function NGM_ChannelForceInstall( game, arg, chenc, service, position )
  {
    this.GxForceInstall( game, arg, chenc, null, position, service );
  };

  this.ChannelLaunchGame = function NGM_ChannelLaunchGame( game, arg, chenc, service, position, architecturePlatform )
  {
    this.GxLaunchGame( game, arg, chenc, null, position, service, architecturePlatform );
  };

  this.MxChannelForceInstall = function NGM_MxChannelForceInstall( game, arg, service, position )
  {
    this.GxForceInstall( game, arg, this.GetCookie( "MSGENC" ), null, position, service );
  };

  this.MxChannelLaunchGame = function NGM_MxChannelLaunchGame( game, arg1, arg2, service, position, architecturePlatform )
  {
    var msenc   = this.GetCookie( "MSGENC" );
    var launchtype  = String( arg1 ).toLowerCase();
    var lastworld = String( arg2 ).toLowerCase();

    if ( lastworld != null && lastworld != "" && lastworld != "undefined" )
    {
      msenc = msenc + ":" + arg2;
    }
    if ( launchtype == "gameluanching" )
    {
      msenc = "";
    }

    this.GxLaunchGame( game, arg1, msenc, null, position, service, architecturePlatform );
  };

  this.DownloadNGM = function NGM_DownloadNGM()
  {
    var DownloadURL = "http://platform.nexon.com/NGM/Bin/Setup.exe";

    location.href = DownloadURL;
  };

  this.OpenInstallAgreement = function NGM_OpenInstallAgreement(download_url)
  {
    var popup_url = NGM.strInstallPage + "?download_url=" + download_url;
    window.open(popup_url, null, "height=500,width=450,status=yes,toolbar=no,menubar=no,location=no");
  };

  this.GetCookie = function NGM_GetCookie( nameVal )
  {
    var numCookie = document.cookie.length;
    var oven = document.cookie.split( '; ' );

    for ( var i = 0; i < oven.length; i++ )
    {
      if ( oven[i].indexOf( '=' ) != -1 )
      {
        cookieName = oven[i].substring( 0, oven[i].indexOf( '=' ) );
      }
      else
      {
        cookieName = oven[i];
      }

      if ( cookieName == nameVal )
      {
        if ( oven[i].indexOf( '=' ) != -1 )
        {
          cookieVal = oven[i].substr( oven[i].indexOf( '=' ) + 1 );
        } else {
          cookieVal = '';
        }
        return cookieVal;
      }
    }
    return '';
  };

  this.StringTrim = function (str) {
    return str.replace(/(^\s*)|(\s*$)/gi,"");
  };

  this.SuccessCallback = function () {
    NGMQuery.queryNGMStatus(5000);
  };

  this.ExecuteNGMByPlugin = function( argument ) {
    var ret = this.objNxGame.ExecuteNGM( String( argument ) );
    if ( 2 == ret ) {
      this.ErrorHandler();
    }
    else if ( 0 != ret ) {
      alert( "Cannot Launch NGM! error code=" + ret );
    }
  };

  this.CheckPluginUnsupportBrowser = function () {
    return this.BrowserInfo != "IE";
  };

  this.RegisterMIDSuccessCallback = function() {
  };

  this.RegisterMIDErrorHandler = function() {
  };

  this.RegisterMID = function(registerMIDToken) {
    this.InitGameControl();

    var a2sk  = this.GetCookie( "A2SK" );
    var npp = this.GetCookie( "NPP" );
    var argument = this.GenerateArgument( "registermid", 0, npp, '', null, a2sk, null, null, null );
    argument += " -registermidtoken:'" + registerMIDToken + "'";
    
    if (CustomScheme.IsSupportedBrowser()) {
      var uri = "ngm://launch/ " + encodeURIComponent( argument );
      CustomScheme.OpenUriWithoutBlur(uri, this.RegisterMIDSuccessCallback, this.RegisterMIDErrorHandler);
      return true;
    }

    return false;
  };

  this.GetPcInfo = function(gamecode, successHandler, errorHandler) {
    this.InitGameControl();

    var a2sk  = this.GetCookie("A2SK");
    var npp = this.GetCookie("NPP");
    var argument = this.GenerateArgument("getpcinfo", gamecode, npp, '', null, a2sk, null, null, null);
    
    if (CustomScheme.IsSupportedBrowser()) {
      var uri = "ngm://launch/ " + encodeURIComponent(argument);

      CustomScheme.OpenUriWithoutBlur(uri, successHandler, errorHandler);
      return true;
    }

    return false;
  }

  this.GetMachineId = function(gamecode, resultCallback) {
    if(MachineIdQuery.intervalStarted) {
      return true;
    }

    this.InitGameControl();

    var a2sk  = this.GetCookie("A2SK");
    var npp = this.GetCookie("NPP");
    var argument = this.GenerateArgument("getpcinfo", gamecode, npp, '', null, a2sk, null, null, null);
    
    if (CustomScheme.IsSupportedBrowser()) {
      var uri = "ngm://launch/ " + encodeURIComponent(argument);
      CustomScheme.OpenUriWithoutBlur(uri, function() { }, function() { });

      var kTimeInterval = 250;
      var kIntervalMaxCount = 100;

      MachineIdQuery.intervalStarted = true;
      MachineIdQuery.intervalId = setInterval(function() {
        try {
          if(MachineIdQuery.intervalCount >= kIntervalMaxCount) {
            resultCallback(-1, "Timeout");
            MachineIdQuery.clear();
          }

          var reqObj = new XMLHttpRequest();
          if (reqObj) {
            reqObj.onreadystatechange = function() {
              if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                if(MachineIdQuery.intervalStarted) {
                  MachineIdQuery.clear();
                  var result = JSON.parse(this.responseText);
                  resultCallback(this.status, result.MachineID);
                  return;
                }
              }
            };

            ++MachineIdQuery.intervalCount;
            reqObj.open("GET", "https://localhost:" + ((gamecode != 0)? (gamecode & 0x0000FFFF) : 19999) + "/getmachineid");
            reqObj.send();
          }
        } catch(e) { }
      }, kTimeInterval);

      return true;
    }

    MachineIdQuery.clear();
    return false;
  }

  function ImportModule(options) {
    var head = document.getElementsByTagName( "head" )[ 0 ],
    script = document.createElement( "script" ),
    loaded = false;
    
    var tgs = document.getElementsByTagName( "script" );
    for( var i = 0, l = tgs.length; i < l; i++ ) {
      var s = tgs[ i ].getAttribute( "src" );
      if( s != null && s.indexOf( options.src ) > -1 ) {
        var n = tgs[ i ].getAttribute( "data-name" );
        if( n !== null && typeof( window[ n ] ) !== "undefined" ) {
          window[ options.name ] = window[ n ];
        }
        break;
      }
    }
    
    if( typeof( window[ options.name ] ) === "object" ) {
      options.complete( window[ options.name ] );
      return;
    }
    
    script.setAttribute( "type", options.type || "text/javascript" );
    script.setAttribute( "charset", options.charset || "utf-8" );
    script.setAttribute( "src", options.src || "" );
    if( typeof( options.data ) !== "undefined" ) {
      for( var d in options.data ) {
        script.setAttribute( "data-" + d.toString(), options.data[ d ] || "" );
      }
    }
    if( typeof( options.name ) !== "undefined" ) {
      script.setAttribute( "data-name", options.name );
    }
    script.onload = script.onreadystatechange = function() {
      var rs = this.readyState;
      if( rs && rs != "complete" && rs != "loaded" ) return;
      if( loaded ) return;
      loaded = true;
      options.complete( window[ options.name ] );
    };
    head.appendChild( script );
  };
};

var NGM = new _NGM();

var NGMQuery = {
  response : null,
  queryGame : 0,
  intervalID : 0,
  timeoutID : 0,
  requests : [],

  clearTimer : function() {
    if (this.intervalID != 0) {
      clearInterval(this.intervalID);
      this.intervalID = 0;
    }
    if (this.timeoutID != 0) {
      clearTimeout(this.timeoutID);
      this.timeoutID = 0;
    }
  },

  clearAllRequests : function() {
    for(i = 0; i < this.requests.length; i++) {
      if (this.requests[i]) {
        this.requests[i].abort();
        this.requests[i] = null;
      }
    }
    this.requests = [];
  },

  initialize : function(queryGame) {
    NGMQuery.response = null;
    NGMQuery.queryGame = queryGame;
  },

  succeeded : function() {
    if (NGMQuery.response == null) {
      NGMQuery.response = true;
      NGMQuery.clearTimer();
      NGMQuery.clearAllRequests();
    }
  },

  failed : function() {
    if (NGMQuery.response == null) {
      NGMQuery.response = false;
      NGMQuery.clearTimer();
      NGMQuery.clearAllRequests();
      NGMQuery.queryFailedNGMStatus();
    }
  },

  queryNGMStatus : function(expiredTime) {
    NGMQuery.clearTimer();
    NGMQuery.clearAllRequests();
		if (expiredTime && expiredTime > 0) {
			NGMQuery.intervalID = setInterval(function(){ NGMQuery.requestToNGM(); }, expiredTime / 5);
			NGMQuery.timeoutID = setTimeout(function(){ NGMQuery.failed(); }, expiredTime);
		}
  },

  requestToNGM : function() {
    try {
      var reqObj = new XMLHttpRequest();
      if (reqObj) {
        reqObj.onreadystatechange = function() {
          if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            NGMQuery.succeeded();
          }
        };

        var port = 0;
        if(NGMQuery.queryGame != 0) {
          port = (NGMQuery.queryGame & 0x0000FFFF);
        } else {
          port = 19999;
        }

        reqObj.open("GET", "https://localhost:" + port + "/ngm/status/");
        reqObj.send();
        NGMQuery.requests[NGMQuery.requests.length] = reqObj;
      }
    } catch(e) { }
  },

  queryFailedNGMStatus : function() {
    try {
      if (typeof(window.localStorage) !== "undefined") {
        var playKey = "play" + NGMQuery.queryGame;
        var playTime = window.localStorage.getItem(playKey);
        var nowTime = new Date();
        if (playTime !== null && (nowTime.getTime() - playTime) < 5*60*1000) {
          if(NGMQuery.queryGame != 106603 && NGMQuery.queryGame != 106604 && NGMQuery.queryGame != 106605) {
            NgmLayer.openNgmLayer();
          }
        }
        window.localStorage.setItem(playKey, nowTime.getTime());
      } else {
        NgmLayer.openNgmLayer();
      }
    }
    catch (ex) { }
  }
};

var MachineIdQuery = {
  intervalStarted : false,
  intervalCount : 0,
  intervalId : 0,
  clear : function() {
    MachineIdQuery.intervalStarted = false;
    MachineIdQuery.intervalCount = 0;
    clearInterval(MachineIdQuery.intervalId);
  }
}
function NxPcChecker() {
    var constants = {
        kStatusCheckMaxCount: 20,
        kStatusCheckInterval: 250,
        kCheckMaxCount: 60,
        kCheckInterval: 500,
        kAvailableMinDocumentMode: 10,
        kNGMDownloadConfirm : "PC사양을 조회하려면 NGM을 설치해야 합니다.\r\nNGM을 다운로드하시겠습니까?",
        errors: {
            kRequestError: -1,
            kOK: 0,
            kNotSupportedOS: 1,
            //kIELowVersion: 2,  Not Used (#PPT-3569, gcyong)
            kNotSupportedBrowser: 3,
            kNGMExecutionFailed: 4,
            //kNGMNotInstalled: 5,  Not Used (#PPT-3569, gcyong)
            kPCSpecRetrieveFailed: 6,
            kAlreadyExecuted: 7
        },
        errorStrings: {
            1: "Windows 7 이상의 PC에서만 사양 체크가 가능합니다.",
            3: "접속하신 브라우저는 지원하지 않는 브라우저입니다.\r\n(지원 브라우저 : IE10+, Chrome, Edge)",
            4: "PC사양을 가져오는 도중 알 수 없는 문제가 발생했습니다. 다시 시도해주세요.",
            6: "PC사양을 가져올 수 없습니다. 다시 시도해주세요.",
            7: "이미 조회 중입니다."
        },
        steps: {
            kNGMStatusCheck: 0,
            kPCSpecCheck: 1
        }
    };

    var helper = {
        isSupportedOS: function () {
            var filter = "win32|win64";
            if (navigator.platform) {
                return filter.indexOf(navigator.platform.toLowerCase()) > -1;
            }

            return false;
        },
        isSupportedBrowser: function () {
            var browser = CustomScheme.CheckBrowser();
            if (browser.isChrome || browser.isEdge) {
                return true;
            } else if (browser.isIE && document.documentMode != null) {
                return (document.documentMode >= constants.kAvailableMinDocumentMode);
            }

            return false;
        }
    };

    var config = {
        checkStep: constants.steps.kNGMStatusCheck,
        checkCount: 0,
        isCheckStarted: false,
        requestPort: 0,
        timerId: null,
        successCallback: null,
        errorCallback: null,
        clearConfig: function () {
            config.checkStep = constants.steps.kNGMStatusCheck;
            config.checkCount = 0;
            config.isCheckStarted = false;
            config.requestPort = 0;
            config.resetInterval();
            config.successCallback = null;
            config.errorCallback = null;
        },
        setRequestPort: function (port) {
            config.requestPort = port;
        },
        setCallbacks: function (successCallback, errorCallback) {
            config.successCallback = successCallback;
            config.errorCallback = errorCallback;
        },
        setCheckStep: function (checkStep) {
            config.checkStep = checkStep;
            config.checkCount = 0;
            config.isCheckStarted = true;
            config.resetInterval();
            if (config.checkStep == constants.steps.kNGMStatusCheck) {
                config.timerId = setInterval(config.requestToNGM, constants.kStatusCheckInterval);
            } else {
                config.timerId = setInterval(config.requestToNGM, constants.kCheckInterval);
            }
        },
        resetInterval: function () {
            if (config.timerId) {
                clearInterval(config.timerId);
                config.timerId = null;
            }
        },
        getMaxCheckCount: function () {
            switch (config.checkStep) {
                case constants.steps.kNGMStatusCheck:
                    return constants.kStatusCheckMaxCount;
                case constants.steps.kPCSpecCheck:
                    return constants.kCheckMaxCount;
            }

            return 0;
        },
        getRequestUrl: function () {
            if (config.checkStep == constants.steps.kNGMStatusCheck) {
                return "https://localhost:" + config.requestPort + "/ngm/status/";
            } else if (config.checkStep == constants.steps.kPCSpecCheck) {
                return "https://localhost:" + config.requestPort + "/getpcinfo";
            }

            return "";
        },
        requestToNGM: function () {
            if (config.checkCount >= config.getMaxCheckCount()) {
                config.resetInterval();
                config.resultCallback(constants.errors.kRequestError, "요청 시간 초과");
                return;
            }

            ++config.checkCount;
            try {
                var request = new XMLHttpRequest();
                if (request) {
                    request._checkStep = config.checkStep;
                    request.onreadystatechange = function () {
                        if (this.readyState == XMLHttpRequest.DONE) {
                            if (config.isCheckStarted && (config.checkStep == this._checkStep)) {
                                if (this.status == 200) {
                                    config.resetInterval();
                                    config.resultCallback(constants.errors.kOK, this.responseText);
                                    return;
                                } else if (this.status == 500) {
                                    config.resetInterval();
                                    config.resultCallback(constants.errors.kRequestError, this.responseText);
                                    return;
                                }
                            }
                        }
                    };
                    request.open("GET", config.getRequestUrl());
                    request.send();
                }
            } catch (e) {

            }
        },
        resultCallback: function (code, data) {
            switch (code) {
                case constants.errors.kOK:
                    if (config.checkStep == constants.steps.kNGMStatusCheck) {
                        config.setCheckStep(constants.steps.kPCSpecCheck);
                    } else {
                        if (config.successCallback) {
                            config.successCallback(data);
                        }
                        config.clearConfig();
                    }
                    break;
                case constants.errors.kRequestError:
                    if (config.checkStep == constants.steps.kNGMStatusCheck) {
                        if (confirm(constants.kNGMDownloadConfirm)) {
                            NGM.DownloadNGM();
                        }
                        config.clearConfig();
                    } else if (config.checkStep == constants.steps.kPCSpecCheck) {
                        if (config.errorCallback) {
                            var error = JSON.parse(data);
                            if (!error) {
                                error = {};
                                error.message = "알 수 없는 오류가 발생했습니다.";
                            }

                            var errorString = constants.errorStrings[constants.errors.kPCSpecRetrieveFailed] + "\r\n(" + error.message + ")";
                            config.errorCallback(constants.errors.kPCSpecRetrieveFailed, errorString);
                        }
                        config.clearConfig();
                    }
                    break;
                default:
                    config.clearConfig();
                    break;
            }
        }
    };

    this.getPcInfo = function (resultCallback, errorCallback, gamecode) {
        if (config.isCheckStarted) {
            errorCallback(
				constants.errors.kAlreadyExecuted,
				constants.errorStrings[constants.errors.kAlreadyExecuted]);
            return;
        }

        if (!helper.isSupportedOS()) {
            errorCallback(
				constants.errors.kNotSupportedOS,
				constants.errorStrings[constants.errors.kNotSupportedOS]);
            return;
        }

        if (!helper.isSupportedBrowser()) {
            errorCallback(
				constants.errors.kNotSupportedBrowser,
				constants.errorStrings[constants.errors.kNotSupportedBrowser]);
            return;
        }

        if (gamecode && (gamecode !== 0)) {
            config.setRequestPort(gamecode & 0x0000FFFF);
        } else {
            var Gnb;
            if (Gnb && Gnb.options && Gnb.options.gameCode && (Gnb.options.gameCode !== 0)) {
                config.setRequestPort(Gnb.options.gameCode & 0x0000FFFF);
                gamecode = Gnb.options.gameCode;
            } else {
                config.setRequestPort(19999);
                gamecode = 0;
            }
        }

        function ngmSuccessHandler() {
            config.setCheckStep(constants.steps.kNGMStatusCheck);
        };

        function ngmErrorHandler() {
            var browser = CustomScheme.CheckBrowser();
            if(browser.isIE) {
                if (confirm(constants.kNGMDownloadConfirm)) {
                    NGM.DownloadNGM();
                }
            } else {
                errorCallback(constants.errors.kNGMExecutionFailed, constants.errorStrings[constants.errors.kNGMExecutionFailed]);
            }
            config.clearConfig();
        };

        config.setCallbacks(resultCallback, errorCallback);
        NGM.GetPcInfo(gamecode, ngmSuccessHandler, ngmErrorHandler);
    }
}

var nxPcChecker = new NxPcChecker();
