let React = require("react");
let ReactDOM= require("react-dom");
import { Router , Route , Link , IndexLink , IndexRoute , browserHistory , hashHistory } from 'react-router';

const Home    = require("./pages/Home.jsx");
const Receive= require("./pages/receive.jsx");
const Order  = require("./pages/order.jsx");
const Type   = require("./pages/type.jsx");
const Stats  = require("./pages/stats.jsx");

const Dashboard = () => (
    <h1>Welcome your coming!</h1>
);


ReactDOM.render(
    <Router history={hashHistory}>
        <Router path="/" component={Home}>
            <IndexRoute component={Dashboard} />
            <Router path="/receive" component={Receive} />
            <Router path="/order" component={Order} />
            <Router path="/type" component={Type} />
            <Router path="/stats" component={Stats} />
        </Router>
    </Router>,
    document.getElementById('example')
);

/*const Hello = React.createClass({
    getInitialState(){
        return {
            isHidden : false
        }
    },
    go(){
        console.log("gggg");
        this.setState({
            isHidden : true
        });
    },
    render(){
        console.log(this.state);
        if(this.state.isHidden){
            return null;
        }

        return (
            <h1 className="abc">
                GG si mi dfdfdda.{this.props.className}
                <button onClick={this.go}>Hidden</button>
            </h1>);
    },
    componentDidMount: function(){
        var componentDOM = ReactDOM.findDOMNode(this);
        console.log(componentDOM,componentDOM.children[0].outerHTML);
    },

    componentWillReciveProps: function(){
        console.log("will reciveProps");
    },

    componentDidUpdate(prevProps, prevState) {
        console.log("comonentDidUpdate");
    },

    componentWillUnmount(){
        console.log("remove component");
    }
})

ReactDOM.render(
    <Hello className="what" />,
    document.getElementById('example')
);*/
