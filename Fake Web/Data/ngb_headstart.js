if ( location.href.toLowerCase().split("://",1)[0] == 'https' )
{
	document.write( '<scr' + 'ipt src ="https://platform.nexon.com/ajax/npf_auth_c.js" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="https://logins.nexon.com/login/page/ngb_login.aspx" type="text/javascript"></scr' + 'ipt>' );
    document.write( '<scr' + 'ipt charset="euc-kr" src ="https://logins.nexon.com/scripts/captchalogin" type="text/javascript"></scr' + 'ipt>' );
    document.write( '<scr' + 'ipt charset="euc-kr" src ="https://ssl.nx.com/s1/global/ngb_pcbanglogin.js?v=20181015" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="https://ssl.nx.com/s1/global/ngb_util.js?v=20190903" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="https://ssl.nx.com/s1/member/nxmember.js?v=20200111" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="https://ssl.nx.com/s1/External/makePCIDCookie.js" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt src ="https://ssl.nx.com/s1/da/a2s.js" type="text/javascript"></scr' + 'ipt>' );
}
else
{
	document.write( '<scr' + 'ipt src ="http://platform.nexon.com/ajax/npf_auth_c.js" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="http://logins.nexon.com/login/page/ngb_login.aspx" type="text/javascript"></scr' + 'ipt>' );
    document.write( '<scr' + 'ipt charset="euc-kr" src ="http://logins.nexon.com/scripts/captchalogin" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="http://js.nx.com/s1/global/ngb_pcbanglogin.js?v=20181015" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="http://js.nx.com/s1/global/ngb_util.js?v=20190903" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="http://js.nx.com/s1/member/nxmember.js?v=20200111" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt charset="euc-kr" src ="http://js.nx.com/s1/External/makePCIDCookie.js" type="text/javascript"></scr' + 'ipt>' );
	document.write( '<scr' + 'ipt src ="http://js.nx.com/s1/da/a2s.js" type="text/javascript"></scr' + 'ipt>' );
}

if( document.location.hostname.indexOf( "nexon.com" ) > -1 )
{
	var xhrp=document.createElement('script');xhrp.type='text/javascript';xhrp.async=true;
	xhrp.src=('https:'==document.location.protocol?'https://ssl':'http://js')+'.nx.com/s1/livewebjs/GnxVisitorTracking.min.js';
	var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(xhrp,s);
}
