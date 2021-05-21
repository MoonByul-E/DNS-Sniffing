$(".loginSec .id input, .loginSec .pass input, .otppass div input, #txtNexonID, #txtPWD").bind("focus", function () {
	$(this).parent("div").addClass("focusInput");
})
	.bind("focusout keyup", function () {
		if ($(this).val() == "") {
			$(this).parent("div").removeClass("hiddenLabel");
		} else {
			$(this).parent("div").addClass("hiddenLabel");
		}
	})
	.bind("focusout", function () {
		$(this).parent("div").removeClass("focusInput");
	});
$(".loginSec .id label, .loginSec .pass label, #txtNexonID, #txtPWD").bind("click", function () {
	$(this).parent("div").children("input").focus();
	$(this).parent("div").addClass("focusInput");
});
$(window).bind("load", function () {
	if ($(".loginSec .id input").val() != "") {
		$(".loginSec .id input").parent("div").addClass("hiddenLabel");
	}
});
$(".btLoginPC a, .btLoginID a").bind("click", function () {
	$("#loginSec").toggle();
	$("#pcBangSec").toggle();
});
(function ($) {
	if (typeof ($.NxLogin) === "undefined") {
		$.NxLogin = {};
	}

	$(Init);

	function Init() {
		$.NxLogin.init();
	}

	$.NxLogin = {
		cnSaveID: "",
		isValidAccount: true,
		initErrorCode: 0, //<%=this.ErrorCode %>,
		RedirectURL: '',
		AuthLevel : 0,
		init: function () {
			if ($.getCookie('IL') == '1') {
				document.location.href = RedirectURL;
			}

			if ($.getCookie('isCafe') == 'true') {
				$('.pcbangMsg').show();
				$('#txtPcBang').show();
				$('#txtGongGong').show();
				$('#txtNotPcBang').hide();
			} else {
				$('.pcbangMsg').hide();
				$('#txtPcBang').hide();
				$('#txtGongGong').hide();
				$('#txtNotPcBang').show();
			}

			if ($.NxLogin.initErrorCode > 0) {
				$.NxLogin.error($.NxLogin.initErrorCode);
			}
			//grecaptcha.enterprise.ready(function () {
			//	grecaptcha.enterprise.execute('6LepL_QZAAAAAEhwfvy0EFqN9CUG4oP3iVzZ7c9E', { action: 'login' }).then(function (token) {
			//		console.log(token);
			//	});
			//});
			$.NxLogin.cnSaveID = PS.nxlogin.getNexonIDCookieName();
			$("input.checkboxDeco:checked").parent("div").children("label").toggleClass("checked");
			$("#btnLogin").bind("click", function () {
				$.NxLogin.Login($.NxLogin.RedirectURL);
				//grecaptcha.enterprise.ready(function () {
				//	try {
				//		if (grecaptcha.enterprise.getResponse() == "") {
				//			$('.d_msgError').html('체크박스를 체크해주세요.').show();
				//		} else {
				//			try {
				//				$.ajax({
				//					type: 'POST'
				//					, url: './recaptcha.aspx'
				//					, data: 'token=' + grecaptcha.enterprise.getResponse()
				//					, success: function (req) {
				//						alert('CheckBox ReCaptcha 테스트 입니다 : 결과값 = ' + req);
				//						$.NxLogin.Login($.NxLogin.RedirectURL);
				//					}, error: function (req) {
				//						$.NxLogin.Login($.NxLogin.RedirectURL);
				//					}
				//				});
				//			} catch (e) {
				//				$.NxLogin.Login($.NxLogin.RedirectURL);
				//			}
				//		}
				//	} catch (e) {
				//		grecaptcha.enterprise.execute('6LepL_QZAAAAAEhwfvy0EFqN9CUG4oP3iVzZ7c9E', { action: 'login' }).then(function (token) {
				//			site_token = token;
				//			console.log(site_token);
				//			var fd = new FormData();
				//			fd.append("token", site_token);
				//			try {
				//				$.ajax({
				//					type: 'POST'
				//					, url: './recaptcha.aspx'
				//					, data: 'token=' + token
				//					, success: function (req) {
				//						alert('ReCaptcha 테스트 입니다 : 결과값 = ' + req);
				//						$.NxLogin.Login($.NxLogin.RedirectURL);
				//					}, error: function (req) {
				//						$.NxLogin.Login($.NxLogin.RedirectURL);
				//					}
				//				});
				//			} catch (e) {
				//				$.NxLogin.Login($.NxLogin.RedirectURL);
				//			}
				//		});
				//	}
				//});
			});
			
			$("#btnLogin2").bind("click", function () {
				$.NxLogin.Login2($.NxLogin.RedirectURL);
			});

			// TPA FACEBOOK
			$("#btnLogin3").bind("click", function () {
				$.NxLogin.Login3($.NxLogin.RedirectURL);
			});
			// TPA GOOGLE
			$("#btnLogin4").bind("click", function () {
				$.NxLogin.Login4($.NxLogin.RedirectURL);
			});
			// TPA NAVER
			$("#btnLogin5").bind("click", function () {
				$.NxLogin.Login5($.NxLogin.RedirectURL);
			});
			// TPA APPLE
			$("#btnLogin6").bind("click", function () {
				$.NxLogin.Login6($.NxLogin.RedirectURL);
			});
			$('#chkSaveID').bind('change', function () {
				if (!$('#chkSaveID').is(":checked")) {
					$.removeCookie($.NxLogin.cnSaveID);
				}
			});
			$("#txtNexonID").bind("keydown", function (e) {
				var keyCode = typeof (e) !== "undefined" ? e.which : event.keyCode;
				if (e.keyCode == 13) {
					$.NxLogin.Login($.NxLogin.RedirectURL);
					return false;
				}
			});

			$("#txtPCBangLogin1").bind("keydown", function (e) {
				var keyCode = typeof (e) !== "undefined" ? e.which : event.keyCode;
				if (e.keyCode == 13) {
					$.NxLogin.Login2($.NxLogin.RedirectURL);
					return false;
				}
			});

			$("#txtPCBangLogin2").bind("keydown", function (e) {
				var keyCode = typeof (e) !== "undefined" ? e.which : event.keyCode;
				if (e.keyCode == 13) {
					$.NxLogin.Login2($.NxLogin.RedirectURL);
					return false;
				}
			});

			$("input.checkboxDeco").bind("change", function () {
				$(this).parent("div").children("label").toggleClass("checked");
			});



			$("#txtPWD").bind("keypress", function (e) {
				var keyCode = typeof (e) !== "undefined" ? e.which : event.keyCode;
				if (e.keyCode == 13) {
					$.NxLogin.Login($.NxLogin.RedirectURL);
					return false;
				}
			});
		},
		Join: function (redirecturl) {
			if ($.NxLogin.AuthLevel === 0) {
				NXMember.GoJoin({ 'accesscode': 1, 'redirect': redirecturl });
			} else {
				NXMember.GoJoin({ 'accesscode': 1, 'authlevel': $.NxLogin.AuthLevel, 'redirect': redirecturl });
			}
		},
		goJoin_M: function (redirecturl) {
			NXMember.GoJoin({ "accesscode": 2000076001, "usetpa": 1, 'redirect': redirecturl });
		},
		findID: function () {
			NXMember.GoFindID({ "redirect": document.location.href });
		},
		findPW: function () {
			NXMember.GoFindPwd({ "redirect": document.location.href });
		},
		Login: function (redirect) {
			var useAOS = false;
			var useSaveID = false;
			var id = $("#txtNexonID").val().trim(),
				pw = $("#txtPWD").val().trim();

			if (id == "") {
				//$('.loginMsg').attr('style', 'display:none;');
				$('.d_msgError').html('넥슨ID(아이디 또는 이메일)를 입력해주세요.').show();
				return false;
			}
			if (pw == "") {
				//$('.loginMsg').attr('style', 'display:none;');
				$('.d_msgError').html('비밀번호를 입력해주세요.').show();
				return false;
			}
			$.ajax({
				type: 'POST'
				, async: false
				, url: './encrypter.aspx'
				, data: 'id=' + id
				, success: function (req) {
					if ($("#chkSaveID").attr("checked")) {
						$.setCookie($.NxLogin.cnSaveID, req, 30);
						useSaveID = true;
					}
					if ($.NxLogin.AuthLevel == 1) {
						NgbLogin.SLogin(id, pw, 0, redirect);
					} else {
						NgbLogin.Login(id, pw, 0, redirect);
					}
				}, error: function (req, status) {
					if ($.NxLogin.AuthLevel == 1) {
						NgbLogin.SLogin(id, pw, 0, redirect);
					} else {
						NgbLogin.Login(id, pw, 0, redirect);
					}
				}
			});
		},
		SLogin: function (redirect) {
			var useAOS = false;
			var useSaveID = false;
			var id = $("#txtNexonID").val().trim(),
				pw = $("#txtPWD").val().trim();

			if (id == "") {
				//$('.loginMsg').attr('style', 'display:none;');
				$('.d_msgError').html('넥슨ID(아이디 또는 이메일)를 입력해주세요.').show();
				return false;
			}
			if (pw == "") {
				//$('.loginMsg').attr('style', 'display:none;');
				$('.d_msgError').html('비밀번호를 입력해주세요.').show();
				return false;
			}
			$.ajax({
				type: 'POST'
				, async: false
				, url: './encrypter.aspx'
				, data: 'id=' + id
				, success: function (req) {
					if ($("#chkSaveID").attr("checked")) {
						$.setCookie($.NxLogin.cnSaveID, req, 30);
						useSaveID = true;
					}
					NgbLogin.SLogin(id, pw, 0, redirect);
				}, error: function (req, status) {
					NgbLogin.SLogin(id, pw, 0, redirect);
				}
			});
		},
		Login2: function (redirect) {
			var useAOS = false;

			var pcbangOtp1 = $('#txtPCBangLogin1').val().trim(),
				pcbangOtp2 = $('#txtPCBangLogin2').val().trim();

			if (pcbangOtp1.length == 4 && pcbangOtp2.length == 4) {
				NgbPCBangLogin.Login(pcbangOtp1 + pcbangOtp2, 0, redirect);
			}
			else {
				$(".d_msgError").html('일회용 로그인 번호를 입력하세요.').show();
				return false;
			}
		},
		Login3: function (redirect) {
			if ($.NxLogin.AuthLevel == 1) {
				NgbLogin.SLoginFacebook(redirect, $.NxLogin.AuthLevel);
			} else {
				NgbLogin.LoginFacebook(redirect, $.NxLogin.AuthLevel);
			}
		
		},
		Login4: function (redirect) {
			if ($.NxLogin.AuthLevel == 1) {
				NgbLogin.SLoginGoogle(redirect, $.NxLogin.AuthLevel);
			} else {
				NgbLogin.LoginGoogle(redirect, $.NxLogin.AuthLevel);
			}
			
		},
		Login5: function (redirect) {
			if ($.NxLogin.AuthLevel == 1) {
				NgbLogin.SLoginNaver(redirect, $.NxLogin.AuthLevel);
			} else {
				NgbLogin.LoginNaver(redirect, $.NxLogin.AuthLevel);
			}
			
		},
		Login6: function (redirect) {
			var agent = new UAParser().getResult();
			if (agent.browser.name == 'IE' && agent.browser.version <= 10) {
				if (confirm('IE 10 이하 버전의 인터넷 익스플로러에서는 Apple 로그인이 정상 작동하지 않을 수 있습니다.\r\n로그인이 원활하지 않을 경우 인터넷 익스플로러를 최신 버전으로 업데이트하여 주세요.')) {
					if ($.NxLogin.AuthLevel == 1) {
						NgbLogin.SLoginApple(redirect, $.NxLogin.AuthLevel);
					} else {
						NgbLogin.LoginApple(redirect, $.NxLogin.AuthLevel);
					}
				}
			} else {
				if ($.NxLogin.AuthLevel == 1) {
					NgbLogin.SLoginApple(redirect, $.NxLogin.AuthLevel);
				} else {
					NgbLogin.LoginApple(redirect, $.NxLogin.AuthLevel);
				}
			}
		},
		LoginProcess: function (result) {
			if (result.RedirectUrl != "") {
				location.href = result.RedirectUrl;
			} else {
				if (result.ResultCode == 0) {
					if (result.Message != "") {
						alert(result.Message);
					}
					$.NxLogin.isValidAccount = true;
					location.reload();
				} else {
					$("#txtNexonID").addClass("failed");
					$("#txtPWD").addClass("failed");
					$("#txtPWD").val("");

					//에러 메세지를 바꿔줄 위치
					$.NxLogin.error(result.ResultCode);
					NgbLogin.InitLoginProcessing();
				}
			}
		},
		clearErrorMsg: function () {
			$(".loginMsg").hide();
		},
		error: function (errorCode) {
			var msg = '';

			$.NxLogin.clearErrorMsg();
			switch (errorCode) {
				case 1:
				case 2:
				case 101:
				case 102:
				case 105:
					msg = '넥슨ID 혹은 비밀번호를 잘못 입력하셨거나 등록되지 않은 넥슨ID 입니다.';
					break;
				case 4:     // 필요 없을 수도 있음.
					msg = '로그인 실패 횟수를 초과했습니다. <br />로그인을 10회 이상 실패하여 10분간 로그인이 중지됩니다.';
					break;
				case 3:
				case 103:
					msg = '관리자에 의해 서비스 이용이 제한되었습니다.<br/>넥슨 고객센터로 문의해주세요.';
					break;
				case 5:
					msg = '넥슨ID 보호를 위해 일시적으로 로그인이 제한되었습니다.<br/>잠시 후 다시 시도해주세요';
					break;
				case 6:
					msg = '시스템 장애로 로그인에 실패하였습니다. 잠시 후 다시 로그인을 시도해주세요.';
					break;
				case 7:
					msg = '이메일ID로 전환하신 고객님입니다.<br/>이메일 형태의 넥슨ID를 입력해주세요.';
					break;
				case 9:
					msg = '일회용 로그인 번호가 일치하지 않습니다.<br/>정확한 번호를 확인 후 다시 입력해주세요.';
					break;
				case 10:
					msg = '잘못된 요청으로 24시간 동안 이용이 제한됩니다.<br/>서비스 이용을 원하신다면 넥슨ID와 비밀번호로 로그인해주시기 바랍니다.';
					break;
				case 17:
					msg = '넥슨 서비스 이용을 위해서는 이메일이 필요합니다.<br/>이메일 정보 제공에 동의하시거나<br/>해당 서비스에서 이메일 등록 후 다시 시도해주세요.';
					break;
				case 18:
					msg = '사용할 수 없는 이메일 정보입니다.<br/>넥슨 서비스 이용을 위해서는 유효한 이메일 정보가 필요합니다.<br/>이메일 정보 변경 후 다시 시도해주세요.';
					break;
				case 19:
					msg = '사용할 수 없는 이메일 정보입니다.<br/>넥슨 로그인을 위해서는 인증된 이메일 정보가 필요합니다.<br/>이메일 정보 인증 후 다시 시도해주세요.';
					break;
				case 20:
					msg = '일회용 로그인이 제한된 IP입니다.<br>넥슨ID와 비밀번호로 로그인해주시기 바랍니다.';
					break;
				case 21:
					msg = '넥슨ID 보호를 위해 일시적으로 로그인이 제한되었습니다.<br/>잠시 후 다시 시도해주세요';
					break;
				default:
					msg = '넥슨ID 혹은 비밀번호를 잘못 입력하셨거나 등록되지 않은 넥슨ID 입니다.[' + errorCode + ']';
					break;
			}
			if (msg != '') {
				$(".d_msgError").html(msg).show();
				$(".loginMsg img").effect("shake", { times: 3 }, 30);
			} else {
				//$( ".d_msgCommon" ).show();
			}
			// 커뮤니티용 페이지 동작
			$(".loginSec").show();
			$("#btLoginNexon span").toggleClass("on");
		}

	};
})(jQuery);