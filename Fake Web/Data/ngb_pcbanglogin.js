

var NgbPCBangLogin = new function __NgbPCBangLogin()
{
	var _isLoginProcessing = false;
	
	var _codeRegSite = 0;
	var _strRedirect;
	var _isPhone = false;
	var _strOTP;
	var _codeRegSite;
	var _strRedirect;
	var _isPhone;
	var _isLogin2;
	var _callBackMethod;
	
	this.SetOTPData = function( strOTP, codeRegSite, strRedirect, isPhone )
	{
		_strOTP = strOTP;
		_codeRegSite = codeRegSite;
		_strRedirect = strRedirect;
		_isPhone = isPhone;
	}
	
	this.InitLoginProcessing = function()
	{
		_isLoginProcessing = false;
	}
	
	this.SubmitLogin = function()
	{
		var strDomain = NgbPCBangLogin.GetLoginURL();
		var strEncData = arguments [ 1 ][ 0 ];
		var codeRegSite = arguments [ 1 ][ 1 ];
		var strRedirect = arguments [ 1 ][ 2 ];
		var isPhone = arguments [ 1 ][ 3 ];
		var isLogin2 = arguments [ 1 ][ 4 ];
		var strCallBackMethod = arguments [ 1 ][ 5 ];

		if ( strEncData == 'Error' )
		{
			alert( "로그인 처리과정 중 오류가 발생하였습니다." );
			return false;
		}
		
		if ( _isLoginProcessing )
		{
			alert( "로그인 하는 중입니다. 잠시만 기다려주세요." );
			return false;
		}
		_isLoginProcessing = true;
		
		if( isLogin2 == false )
		{		
			NgbClientForm.AddChildForSubform( 'strEncData', strEncData );
			NgbClientForm.AddChildForSubform( 'codeRegSite', codeRegSite );
			
			if ( typeof( strRedirect ) != 'undefined' )
				NgbClientForm.AddChildForSubform( 'strRedirect', strRedirect );

			NgbClientForm.AddChildForSubform( 'isPCBangLogin', '1' );
				
			if ( typeof( isPhone ) == 'undefined' )
				isPhone = false;

			if ( isPhone == false )
				NgbClientForm.SubmitForm( 'https://' + strDomain + '/login/page/loginproc.aspx' );
			else
				NgbClientForm.SubmitForm( 'https://' + strDomain + '/login/page/loginphone.aspx' );
		}
		else
		{
			var iframe;
			
			try
			{
				iframe = document.createElement( "<iframe name='iframe1' />" );
			} catch ( ex ) {
				iframe = document.createElement( "iframe" );
				iframe.name = "iframe1";
			}
			
			iframe.src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"nexon.com\\\";<\\\\/script>\\');document.close();};<\/script>'";
			iframe.style.display = "none";
			document.body.appendChild( iframe ); 

			var encData = document.createElement( "input" );
			encData.setAttribute( "type", "hidden" );
			encData.setAttribute( "name", "strEncData" );
			encData.setAttribute( "value", strEncData );
			
			var callBackMethod = document.createElement( "input" );
			callBackMethod.setAttribute( "type", "hidden" );
			callBackMethod.setAttribute( "name", "strCallBackMethod" );
			callBackMethod.setAttribute( "value", strCallBackMethod );
			
			var isPCBangLogin = document.createElement( "input" );
			isPCBangLogin.setAttribute( "type", "hidden" );
			isPCBangLogin.setAttribute( "name", "isPCBangLogin" );
			isPCBangLogin.setAttribute( "value", "1" );

			var form = document.createElement( "form" );
			form.method = "post";
			form.target = "iframe1";
			form.action = "https://" + strDomain + "/login/page/loginproc2.aspx";
			form.appendChild( encData );
			form.appendChild( callBackMethod );
			form.appendChild( isPCBangLogin );

			document.body.appendChild( form );
			
			NgbPCBangLogin.PollSubmit( form );
		}
	}
	
	this.PollSubmit = function( form )
	{
		try
		{
			form.submit();
		}
		catch( e )
		{
			setTimeout(function() { // set a timeout to give browsers a chance to recognize the <iframe> 
				NgbPCBangLogin.PollSubmit( form );
			}, 100 );
		}
	}

	this.Login = function( strOTP, codeRegSite, strRedirect, isPhone )
	{
		NgbPCBangLogin.SetOTPData( strOTP, codeRegSite, strRedirect, isPhone );
		_isLogin2 = false;
		
		NgbPCBangLogin.MemberLogin()
	}
	
	this.Login2 = function( strOTP, callBackMethod )
	{
		if( typeof( callBackMethod ) == "undefined" || callBackMethod == "" )
		{
			alert( "로그인 처리과정 중 오류가 발생하였습니다." );
			return;
		}
		
		NgbPCBangLogin.SetOTPData( strOTP );
		_isLogin2 = true;
		_callBackMethod = callBackMethod;
		
		NgbPCBangLogin.MemberLogin()
	}
	
	this.MemberLogin = function()
	{
		strOTP = _strOTP;
		codeRegSite = _codeRegSite;
		strRedirect = _strRedirect;
		isPhone = _isPhone;
		
		var strDomain = NgbPCBangLogin.GetLoginURL();
		strOTP = NgbString.Trim( strOTP );
		
		if ( typeof( codeRegSite ) == 'undefined' )
			codeRegSite = 0;
			
		if ( typeof( isPhone ) == 'undefined' )
			isPhone = false;
		
		if ( strOTP == '' || strOTP.indexOf( ' ' ) != -1 || ( strOTP >= 0 || strOTP < 0 ) == false || strOTP.length != 8 )
		{
			alert( '일회용 로그인 번호가 잘못되었습니다.\n정확한 번호를 확인 후 다시 입력해주세요.' );
			return;
		}
		
		_codeRegSite = codeRegSite;
		_strRedirect = strRedirect;
		_isPhone = isPhone;
		
		try
		{
			NgbSecurity.InitData();
			NgbSecurity.AddData( strOTP );
			NgbSecurity.SetURL( 'https://' + strDomain + '/login/page/encryptinfo.aspx', '로그인 하는 중입니다. 잠시만 기다려주세요.' );
			NgbSecurity.Encrypt( NgbPCBangLogin.EncryptHandler );
		}
		catch( e )
		{
			NgbEVM.AddCommand( NgbEVM.k_nEventType_onPageEnd, new NgbEVMDelegator( NgbPCBangLogin.SubmitLogin ), '', _codeRegSite, _strRedirect, _isPhone, _isLogin2, _callBackMethod );
		}
	}
	
	this.EncryptHandler = function( encData )
	{
		NgbEVM.AddCommand( NgbEVM.k_nEventType_onPageEnd, new NgbEVMDelegator( NgbPCBangLogin.SubmitLogin ), encData, _codeRegSite, _strRedirect, _isPhone, _isLogin2, _callBackMethod );
	}

	this.Logout = function( strURL )
	{
		var strDomain = NgbPCBangLogin.GetLoginURL();
	
		if ( typeof( strURL ) == 'undefined' )
			strURL = document.location.href;
		
		document.location.href = 'http://' + strDomain + '/login/page/logout.aspx?redirect=' + escape( strURL );
	}
	
	this.GetLoginURL = function()
	{
		var strDomain;
		
		try
		{
			strDomain = NgbUrl.GetDomainURL();
		}
		catch ( e )
		{
			strDomain = 'login.nexon.com';
		}
		
		switch ( strDomain )
		{
			case 'df.nexon.com' : 
			case 'dflogin.nexon.com' : 
				return 'dflogin.nexon.com';
			default : 
				return 'login.nexon.com';
		}
	}
}

var NgbQRLogin = new function __NgbQRLogin()
{
	var _isLoginProcessing = false;
	
	var _strToken;
	var _strUsageId;
	var _strServiceId;
	var _strRedirect;
	var _isLogin2;
	var _callBackMethod;
	
	this.SetQRData = function( strToken, strUsageId, strServiceId )
	{
		_strToken = strToken;
		_strUsageId = strUsageId;
		_strServiceId = strServiceId;
	}
	
	this.InitLoginProcessing = function()
	{
		_isLoginProcessing = false;
	}
	
	this.SubmitLogin = function()
	{
		var strDomain = NgbQRLogin.GetLoginURL();
		var strToken = arguments [ 1 ][ 0 ];
		var strUsageId = arguments [ 1 ][ 1 ];
		var strServiceId = arguments [ 1 ][ 2 ];
		var strRedirect = arguments [ 1 ][ 3 ];
		var isLogin2 = arguments [ 1 ][ 4 ];
		var strCallBackMethod = arguments [ 1 ][ 5 ];
		
		if ( _isLoginProcessing )
		{
			alert( "로그인 하는 중입니다. 잠시만 기다려주세요." );
			return false;
		}
		_isLoginProcessing = true;
		
		if( isLogin2 == false )
		{		
			NgbClientForm.AddChildForSubform( 'strToken', strToken );
			NgbClientForm.AddChildForSubform( 'strUsageId', strUsageId );
			NgbClientForm.AddChildForSubform( 'strServiceId', strServiceId );
			
			if ( typeof( strRedirect ) != 'undefined' )
				NgbClientForm.AddChildForSubform( 'strRedirect', strRedirect );

			NgbClientForm.AddChildForSubform( 'isQRLogin', '1' );
			
			NgbClientForm.SubmitForm( 'https://' + strDomain + '/login/page/loginproc.aspx' );
		}
		else
		{
			var iframe;
			
			try
			{
				iframe = document.createElement( "<iframe name='iframe1' />" );
			} catch ( ex ) {
				iframe = document.createElement( "iframe" );
				iframe.name = "iframe1";
			}
			
			iframe.src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"nexon.com\\\";<\\\\/script>\\');document.close();};<\/script>'";
			iframe.style.display = "none";
			document.body.appendChild( iframe ); 

			var token = document.createElement( "input" );
			token.setAttribute( "type", "hidden" );
			token.setAttribute( "name", "strToken" );
			token.setAttribute( "value", strToken );
			
			var usageId = document.createElement( "input" );
			usageId.setAttribute( "type", "hidden" );
			usageId.setAttribute( "name", "strUsageId" );
			usageId.setAttribute( "value", strUsageId );
			
			var serviceId = document.createElement( "input" );
			serviceId.setAttribute( "type", "hidden" );
			serviceId.setAttribute( "name", "strServiceId" );
			serviceId.setAttribute( "value", strServiceId );
			
			var callBackMethod = document.createElement( "input" );
			callBackMethod.setAttribute( "type", "hidden" );
			callBackMethod.setAttribute( "name", "strCallBackMethod" );
			callBackMethod.setAttribute( "value", strCallBackMethod );
			
			var isQRLogin = document.createElement( "input" );
			isQRLogin.setAttribute( "type", "hidden" );
			isQRLogin.setAttribute( "name", "isQRLogin" );
			isQRLogin.setAttribute( "value", "1" );

			var form = document.createElement( "form" );
			form.method = "post";
			form.target = "iframe1";
			form.action = "https://" + strDomain + "/login/page/loginproc2.aspx";
			form.appendChild( token );
			form.appendChild( usageId );
			form.appendChild( serviceId );
			form.appendChild( callBackMethod );
			form.appendChild( isQRLogin );

			document.body.appendChild( form );
			
			NgbQRLogin.PollSubmit( form );
		}
	}
	
	this.PollSubmit = function( form )
	{
		try
		{
			form.submit();
		}
		catch( e )
		{
			setTimeout(function() { // set a timeout to give browsers a chance to recognize the <iframe> 
				NgbQRLogin.PollSubmit( form );
			}, 100 );
		}
	}
	
	this.Login = function( strToken, strUsageId, strServiceId, strRedirect )
	{
		NgbQRLogin.SetQRData( strToken, strUsageId, strServiceId );
		_isLogin2 = false;
		_strRedirect = strRedirect;
		
		NgbQRLogin.MemberLogin()
	}
	
	this.Login2 = function( strToken, strUsageId, strServiceId, callBackMethod )
	{
		if( typeof( callBackMethod ) == "undefined" || callBackMethod == "" )
		{
			alert( "로그인 처리과정 중 오류가 발생하였습니다." );
			return;
		}
		
		NgbQRLogin.SetQRData( strToken, strUsageId, strServiceId );
		_isLogin2 = true;
		_callBackMethod = callBackMethod;
		
		NgbQRLogin.MemberLogin()
	}
	
	this.MemberLogin = function()
	{
		try
		{
			NgbEVM.AddCommand( NgbEVM.k_nEventType_onPageEnd, new NgbEVMDelegator( NgbQRLogin.SubmitLogin ), _strToken, _strUsageId, _strServiceId, _strRedirect, _isLogin2, _callBackMethod );
		}
		catch( e )
		{
			NgbEVM.AddCommand( NgbEVM.k_nEventType_onPageEnd, new NgbEVMDelegator( NgbQRLogin.SubmitLogin ), '', '', '', _strRedirect, _isLogin2, _callBackMethod );
		}
	}
	
	this.Logout = function( strURL )
	{
		var strDomain = NgbQRLogin.GetLoginURL();
	
		if ( typeof( strURL ) == 'undefined' )
			strURL = document.location.href;
		
		document.location.href = 'http://' + strDomain + '/login/page/logout.aspx?redirect=' + escape( strURL );
	}
	
	this.GetLoginURL = function()
	{
		var strDomain;
		
		try
		{
			strDomain = NgbUrl.GetDomainURL();
		}
		catch ( e )
		{
			strDomain = 'login.nexon.com';
		}
		
		switch ( strDomain )
		{
			case 'df.nexon.com' : 
			case 'dflogin.nexon.com' : 
				return 'dflogin.nexon.com';
			default : 
				return 'login.nexon.com';
		}
	}
}
