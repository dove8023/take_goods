let React = require("react");


const LoginFrom = React.createClass({
    getInitialState(){
        return {
            "phone" : "",
            "password":""
        }
    },    
    handleChange (e){
        e.preventDefault();
        var phone = this.state.phone.trim(),
            password=this.state.password.trim();

        //验证
        if(!phone || !password){
            alert("请输入的信息有误");
            return;
        }

        $.post(this.props.api , {
            "phone" : phone,
            "password":password
        } , (data)=>{
            if(data.state == 1){
                location.href = "/";
            }else{
                alert(data.msg);
            }
        });
    },
    handlePhone (e){
        this.setState({ phone : e.target.value });
    },
    handlePassword (e){
        this.setState({ password : e.target.value });
    },
    render: function() {
        return (
            <form className="loginBox"> 
                <h1>登陆</h1>
                <div className="form-group">
                    <label>手机号</label>
                    <input type="text" name="phone" onChange={this.handlePhone} placeholder="请输入手机号码" />
                </div>
                <div className="form-group">
                    <label>密码</label>
                    <input type="password" name="password" onChange={this.handlePassword} placeholder="请输入密码" />
                </div>
                <div className="form-group loginBox_btn clearfix">
                    <input type="submit" onClick={this.handleChange} value="登陆" />
                </div>
            </form>
        );
    }
});

export default LoginFrom;