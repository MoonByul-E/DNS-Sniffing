//--ngb_head
if ( location.href.toLowerCase().split("://",1)[0] == 'https' )
{
	document.write( '<scr' + 'ipt src ="https://ssl.nx.com/s1/global/ngb_headstart.js?v=' + new Date().getTime() + '" type="text/javascript"></scr' + 'ipt>' );
}
else
{
	document.write( '<scr' + 'ipt src ="http://js.nx.com/s1/global/ngb_headstart.js?v=' + new Date().getTime() + '" type="text/javascript"></scr' + 'ipt>' );
}
