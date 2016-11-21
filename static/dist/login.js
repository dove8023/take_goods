webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(263);


/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(2);

	__webpack_require__(6);

	__webpack_require__(8);

	__webpack_require__(10);

	__webpack_require__(12);

	__webpack_require__(14);

	__webpack_require__(16);

	__webpack_require__(18);

	__webpack_require__(264);

/***/ },

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _loginForm = __webpack_require__(265);

	var _loginForm2 = _interopRequireDefault(_loginForm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var React = __webpack_require__(23);
	var ReactDOM = __webpack_require__(117);


	ReactDOM.render(React.createElement(_loginForm2.default, { api: "/api/login" }), document.getElementById('example'));

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var React = __webpack_require__(23);

	var LoginFrom = React.createClass({
	    displayName: "LoginFrom",
	    getInitialState: function getInitialState() {
	        return {
	            "phone": "",
	            "password": ""
	        };
	    },
	    handleChange: function handleChange(e) {
	        e.preventDefault();
	        var phone = this.state.phone.trim(),
	            password = this.state.password.trim();

	        //验证
	        if (!phone || !password) {
	            alert("请输入的信息有误");
	            return;
	        }

	        $.post(this.props.api, {
	            "phone": phone,
	            "password": password
	        }, function (data) {
	            if (data.state == 1) {
	                location.href = "/";
	            } else {
	                alert(data.msg);
	            }
	        });
	    },
	    handlePhone: function handlePhone(e) {
	        this.setState({ phone: e.target.value });
	    },
	    handlePassword: function handlePassword(e) {
	        this.setState({ password: e.target.value });
	    },

	    render: function render() {
	        return React.createElement(
	            "form",
	            { className: "loginBox" },
	            React.createElement(
	                "h1",
	                null,
	                "\u767B\u9646"
	            ),
	            React.createElement(
	                "div",
	                { className: "form-group" },
	                React.createElement(
	                    "label",
	                    null,
	                    "\u624B\u673A\u53F7"
	                ),
	                React.createElement("input", { type: "text", name: "phone", onChange: this.handlePhone, placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801" })
	            ),
	            React.createElement(
	                "div",
	                { className: "form-group" },
	                React.createElement(
	                    "label",
	                    null,
	                    "\u5BC6\u7801"
	                ),
	                React.createElement("input", { type: "password", name: "password", onChange: this.handlePassword, placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801" })
	            ),
	            React.createElement(
	                "div",
	                { className: "form-group loginBox_btn clearfix" },
	                React.createElement("input", { type: "submit", onClick: this.handleChange, value: "\u767B\u9646" })
	            )
	        );
	    }
	});

	exports.default = LoginFrom;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(259)))

/***/ }

});