/**
 * author@Mr.He
 * time  @2016.10.18
 *content@type manage.
*/
console.log(123);
let React = require("react");
let ReactDOM= require("react-dom");
let Typelist = React.createClass({
    getInitialState() {
        return {
            data : []
        }  
    },
    componentDidMount() {
        console.log(this.props.api);
        $.get(this.props.api , (data)=>{
            if(data.state){
                console.log(data.rows)
                this.setState({
                    data : data.data.rows
                });

                console.log(this.state);
            }else{
                alert(data.msg);
            }
        })
    },
    say(name){
        console.log(name)
    },
    render(){
        var i = 1;
        return (
            <div>
                <ul className="type_list type_box mb10">
                    {
                        this.state.data.map((item) => {
                            return (
                                <li key={item.id}>
                                    <b>{i++}</b>
                                    <strong>{item.name}</strong>
                                    <em>{item.price}  &nbsp;元/KG</em>
                                    <span>{item.createdAt}</span>
                                    <button onClick={()=>{ this.say(item) }} className="m0">修改/删除</button>
                                </li>
                            );
                        })
                    }
                </ul>
                <button>add One</button>
            </div>
        );
    }
});


module.exports = () => (
    <div>
        <h2>品种管理</h2>
        <Typelist api="/api/type/list" />
       
    </div>
); 


/*
<ul className="type_list type_box mb10">
    <li>
        <b>1</b>
        <strong>Test</strong>
        <em>22  &nbsp;元/KG</em>
        <span>2016-09-29T06:00:25.000Z</span>
        <button className="m0">修改/删除</button>
    </li>
</ul>
    */