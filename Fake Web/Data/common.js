var doc = document;

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}

function OnlyNumbers(e) {

	var keyValue = 0;
	if (e == null) {
		e = event;
	}
	if (e.charCode != undefined) {
		keyValue = e.charCode;
	} else {
		keyValue = e.keyCode;
	}

	if ((keyValue < 48 || keyValue > 57) && keyValue != 0) {
		//$('.loginMsg').show();
		$('.loginMsg').html('일회용 로그인 번호는 숫자만 입력이 가능합니다.').show();
		return false;
	}
	$('.loginMsg').attr('style', 'display:none;');
	//$('.d_msgError_common').html('').show();
	return true;
}
$.setCookie = function (name, value, expiredays) {
	var todayDate = new Date;
	if (expiredays < 0)
		doc.cookie = name + "=" + escape(value) + "; path=/; domain=nexon.com;";
	else {
		todayDate.setDate(todayDate.getDate() + expiredays);
		doc.cookie = name + "=" + escape(value) + "; path=/; domain=nexon.com; expires=" + todayDate.toGMTString() + ";";
	}
};
$.getCookie = function (name) {
	var nameOfCookie = name + "="
		, x = 0;
	while (x <= doc.cookie.length) {
		var y = x + nameOfCookie.length;
		if (doc.cookie.substring(x, y) == nameOfCookie) {
			if ((endOfCookie = doc.cookie.indexOf(";", y)) == -1)
				endOfCookie = doc.cookie.length;
			return unescape(doc.cookie.substring(y, endOfCookie));
		}
		x = doc.cookie.indexOf(" ", x) + 1;
		if (x == 0)
			break;
	}
	return "";
};
$.removeCookie = function (name) {
	var todayDate = new Date;
	todayDate.setDate(todayDate.getDate() - 1);
	doc.cookie = name + "=; path=/; domain=nexon.com; expires=" + todayDate.toGMTString() + ";";
};
function setA2SLog($target) {
	$target.find("[a2s]").each(function () {
		if ($(this).attr("a2s") == "exposure" && !$(this).is(":hidden"))
			$h.a2s.sendContentsLog($(this).attr("obj"), $(this).attr("opt"));
		$(this).click(function () {
			$h.a2s.sendClickLog($(this).attr("obj"), $(this).attr("opt"));
		});
	});
}

$(function () {
	setA2SLog($(document));
});