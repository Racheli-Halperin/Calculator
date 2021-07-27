class CalculatorInput extends React.Component {

    state = {
        first: this.props.first,
        sec: this.props.sec,
        opp:this.props.opp,
        res:this.props.res
    };

    handleFirstChange = e => {
        this.setState({ first: e.target.value });
        
    };

    handleSecChange = e => {
        this.setState({ sec: e.target.value });
         

    };
    handleOpperationChange = e => {
        this.setState({ opp: e.target.value });
         

    };
    componentDidMount() {
        window.setInterval(  this.setState({
            sec: this.props.sec,
            first: this.props.first,
            opp: this.props.opp,
            res:this.props.res
        }),1000);
    };
    componentWillMountMount() {
        this.setState({
            sec: this.props.sec,
            first: this.props.first,
            opp: this.props.opp,
            res:this.props.res
        });
    };
   
      
    handleSubmit = e => {
        e.preventDefault();
        var d = this.state.first;
        var d1 = this.state.sec;
        var opp = this.state.opp;
        if (!d || !d1 || !opp) {
            return;
        }
        this.props.onCalcSubmit({ d: d, d1: d1, opp: opp });
        this.setState({ d: 0, d1: 0 });
    };
    render() { 
       
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="number" id="first" onChange={this.handleFirstChange} value={this.state.first}   />
                <select onChange={this.handleOpperationChange} value={this.state.opp}>
                    <optgroup>
                        <option value="" > </option>
                        <option value="Add" id="Add" >+</option>
                        <option value="Div" id="Div" >/</option>
                        <option value="Mul" id="Mul">*</option>
                        <option value="Diff" id="Diff">-</option>
                    </optgroup>
                </select>
                <input type="number" id="secound" value={this.state.sec} onChange={this.handleSecChange} />
                <input type="submit" value="=" />
                <label>{this.props.res}</label>
            </form>);


    }

}

class HistoryItem extends React.Component {
    state = {
        text: this.props.text,
        calcData: this.props.calcData
    }
    // componentDidUpdate(){
    //     this.forceUpdate();
    // }
    componentDidMount() {
        this.setState({ calcData: this.state.calcData });
        
    }
  hendleUpdate=e=>{
    e.preventDefault();
    this.props.onUpdate(this.state.calcData);
  }
    handleDelete = e => {
        e.preventDefault();
        this.props.OnDeleteCalc(this.state.calcData);
    }
    render() {
        return (<div>
            <label >{this.state.calcData.data}</label>
            <i className="far fa-times-circle" onClick={this.handleDelete}></i>
            <i className="fas fa-arrow-circle-right" onClick={this.hendleUpdate}></i>
        </div>);

    }


}
class CalculatorHistoryBoard extends React.Component {

    state = {
        historyData: this.props.historyData
    }
   
    componentDidMount() {
        window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
    // componentDidUpdate(){
    //     this.forceUpdate();
    // }
    render() {
        if (!this.props.historyData || this.props.historyData.length == 0)
            return <div></div>;
        var henDel = this.props.OnDeleteC;
        var onUpdate = this.props.onUpdate;

        var historyNode = this.props.historyData.map(function (hist) {
            return (
                <HistoryItem text={hist.data} calcData={hist} OnDeleteCalc={henDel} onUpdate={onUpdate}/>

            );
        });
        return <div className="historyBoard">
            {historyNode}
        </div>;
    }


}

class Calculator extends React.Component {

    state = { data: this.props.initialData ,first:0,sec:0,opp:"",res:""};
    componentDidMount() {
        this.setState({ data: this.state.data,res:this.state.res });
        this.forceUpdate();
    }
   
    loadCommentsFromServer = () => {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    };
    componentDidUpdate(){}
    hendleUpdate=e=>{
        this.setState({ first:e.d,
              sec:e.d2,opp:e.opp,res:e.res});
              this.forceUpdate();
    }
    handleDeleteCalc = e => {
        var calc = e;
        var data = new FormData();
        data.append('d', calc.d);
        data.append('d2', calc.d2);
        data.append('opp', calc.opp);
        data.append('Id', calc.id);



        var xhr = new XMLHttpRequest();
        xhr.open('delete', this.props.removeUrl, true);
        xhr.onload = function (responseText) {
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    }
    handleCalculatorSubmit = calc => {
        var calcs = this.state.data ? this.state.data : [];
        calc.id = -1;
        var newClac = calcs.concat([calc]);
        this.setState({ data: newClac });

        var data = new FormData();
        data.append('d', calc.d1);
        data.append('d2', calc.d2);
        data.append('opp', calc.opp);


        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.setState({res:xhr.responseText});
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    };
    render() {
        return <div>
            <div>
                <CalculatorInput onCalcSubmit={this.handleCalculatorSubmit}  first={this.state.first} res={this.state.res} sec={this.state.sec} opp={this.state.opp}/>
                <br />
                <CalculatorHistoryBoard historyData={this.state.data} OnDeleteC={this.handleDeleteCalc} onUpdate={this.hendleUpdate} />
            </div>
        </div>
    }
}

