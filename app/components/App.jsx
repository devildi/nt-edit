import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField'
import DatePicker from 'material-ui/DatePicker';
import axios from 'axios'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton'
import { HashRouter, Route, Link} from 'react-router-dom'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

require('./App.css');

const url = '/api/admin/post'
const cache1 = []

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	name : '',
    	indexOfDay: '',
    	date: null,
    	nameOfScene: '',
    	location: '',
    	des: '',
    	pointOrNot: '',
    	category: '',
    	cache: []
    }
  }

  _add(){
  	var that = this
		if(!this.state.nameOfScene || !this.state.location || !this.state.des || !this.state.pointOrNot ||!this.state.category){
			return alert('有空未填！')
		}
  	cache1.push({
  		nameOfScene: this.state.nameOfScene,
  		location: this.state.location,
  		des: this.state.des,
  		pointOrNot: this.state.pointOrNot,
  		category: this.state.category
  	})
  	this.setState({
  		cache: cache1,
  		nameOfScene: '',
    	location: '',
    	des: '',
    	pointOrNot: '',
    	category: ''
  	})
  }

  _delete(c){
  	cache1.splice(c,1)
  	this.setState({cache: cache1})
  }

  _submit(){
  	if(!this.state.name || !this.state.indexOfDay || !this.state.date ||!this.state.cache){
			return alert('有空未填！')
		}
  	axios.post(url, {
			name: this.state.name,
			indexOfDay: this.state.indexOfDay,
			date: this.state.date,
			cache: cache1
		})
		.then(function (response) {
			if(response.data){
				alert('完成当日规划！')
				history.go(0)
			}
	  })
	  .catch(function (error) {
	    console.log(error)
	  })
  }

  render() {
  	let cache = this.state.cache
    return (
      <div>
	      <AppBar
			    title={<span style={{}}>我的行程</span>}
			    iconElementRight={<FlatButton label="完成" />}
			    iconElementLeft={ <Link to='/a/1'><IconButton style={{color: 'white'}}><MoreVertIcon /></IconButton></Link>}
			    onRightIconButtonTouchTap={this._submit.bind(this)}
			  />
      	<div className='division'>
	      	<TextField floatingLabelText="行程编号" floatingLabelFixed={true} value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}/><br />
	      	<TextField floatingLabelText="行程第几天" floatingLabelFixed={true} value={this.state.indexOfDay} onChange={(e) => {this.setState({indexOfDay: e.target.value})}}/><br />
	      	<DatePicker value={this.state.date} onChange={(event, date) => {console.log(date);this.setState({date: date})}} hintText="具体日期" />
	      	{
	      		cache&&cache.length > 0
	      		?	cache.map((i,c) => (
	      				<div key={c} className='cardStyle'>
	      					<RaisedButton label="删除此景点" className='cardBtn' onTouchTap={() => this._delete(c)}/>
		      				<Card style={{marginBottom: '5px'}}>
								    <CardHeader
								      title={i.nameOfScene}
								      subtitle={i.location}
								    />
								    <CardText>{i.des}</CardText>
								  </Card>
								</div>
	      			))
	      		: null
	      	}
	      	<div className='block'>
	      		<div>
	      			<TextField floatingLabelText="景点名称" floatingLabelFixed={true} style={{marginRight:'20px'}}value={this.state.nameOfScene} onChange={(e) => {this.setState({nameOfScene: e.target.value})}}/>
	      			<TextField floatingLabelText="坐标" floatingLabelFixed={true}style={{marginRight:'20px'}}value={this.state.location} onChange={(e) => {this.setState({location: e.target.value})}}/>
	      			<TextField floatingLabelText="描述" floatingLabelFixed={true}style={{marginRight:'20px'}}value={this.state.des} onChange={(e) => {this.setState({des: e.target.value})}}/>
	      			<TextField floatingLabelText="是否是点" hintText="0/1" floatingLabelFixed={true}value={this.state.pointOrNot} onChange={(e) => {this.setState({pointOrNot: e.target.value})}}/>
	      			<TextField floatingLabelText="类别" hintText="0/1/2/3(景/吃/住/行)" floatingLabelFixed={true}value={this.state.category} onChange={(e) => {this.setState({category: e.target.value})}}/>
	      		</div>
	      		<RaisedButton label="添加" primary={true} onTouchTap={this._add.bind(this)}/>
	      	</div>      	
	      </div>
      </div>
    );
  }
}

class App2 extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	cache: [],
    	open: true,
    	name: '',
    	indexOfDay: ''
    }
  }

  handleClose(){
  	if(!this.state.name){
			return alert('行程编号必填！！')
		}
  	const that = this
  	axios.get('/api/admin/get', {
  		params: {
	      name: this.state.name,
	      indexOfDay: this.state.indexOfDay
	    }
  	})
  	.then(function (response) {
			if(response.data.data.length > 0){
				that.setState({cache: response.data.data})
			} else{
				alert('您暂时没有相关定制数据！')
			}
	  })
	  .catch(function (error) {
	    console.log(error)
	  })
  }

  _delete(index, i, cache){
  	cache[index].route.splice(i,1)
  	this.setState({cache: cache})
  }

  _save(){
  	let that = this
  	//console.log(this.state.cache)
  	axios.post('/api/admin/save', {
			cache: this.state.cache
		})
		.then(function (response) {
			if(response){
				console.log(response)
				//that.setState({cache: response.data.data})
				alert('修改数据成功！')
			}
	  })
	  .catch(function (error) {
	    console.log(error)
	  })
  }

  render(){
  	const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ]
  	let cache = this.state.cache
  	return(
  		<div>
	  	{
	  		cache.length === 0
	  		?<Dialog
          title="修改行程信息："
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div>请填写下列信息：</div>
          <TextField hintText='行程编号' value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}/><br />
	      	<TextField hintText='行程第几天' value={this.state.indexOfDay} onChange={(e) => {this.setState({indexOfDay: e.target.value})}}/><br />
        </Dialog>
	  		:<div>
	  			<AppBar
				    title={<span style={{}}>我的行程</span>}
				    iconElementRight={<FlatButton label="保存" />}
				    iconElementLeft={ <Link to='/'><IconButton style={{color: 'white'}}><MoreVertIcon /></IconButton></Link>}
				    onRightIconButtonTouchTap={this._save.bind(this)}
				  />
				  <div className='title'>行程编号:{cache[0].user}</div>
				  {
				  	cache.map((row, index) => (
				  		<div className='division' key={index}>
						 
				      	<div className='day'>
				      		<TextField floatingLabelText="行程第几天" floatingLabelFixed={true} value={cache[index].indexOfDay} onChange={(e) => {this.setState({indexOfDay: e.target.value})}}/>
				      	</div>
				      	<DatePicker value={cache[index].date} onChange={(event, date) => {console.log(date);cache[index].date = date;this.setState({cache: cache})}} hintText="具体日期" />
				      	{
				      		cache[index].route.map((r, i) => (
										<div className='block' key={i}>
						      		<div className='block1'>
						      			<TextField floatingLabelText="景点名称" floatingLabelFixed={true} style={{marginRight:'20px'}}value={r.nameOfScene} onChange={(e) => {cache[index].route[i].nameOfScene = e.target.value;this.setState({cache: cache})}}/>
						      			<TextField floatingLabelText="坐标" floatingLabelFixed={true}style={{marginRight:'20px'}}value={r.location} onChange={(e) => {cache[index].route[i].location = e.target.value ;this.setState({cache: cache})}}/>
						      			<TextField floatingLabelText="描述" floatingLabelFixed={true}style={{marginRight:'20px'}}value={r.des} onChange={(e) => {cache[index].route[i].des = e.target.value;this.setState({cache: cache})}}/>
						      			<TextField floatingLabelText="是否是点" hintText="0/1" floatingLabelFixed={true} value={r.pointOrNot} onChange={(e) => {cache[index].route[i].pointOrNot = e.target.value;this.setState({cache: cache})}}/>
						      			<TextField floatingLabelText="类别(0/1/2/3(景/吃/住/行))" hintText="0/1/2/3(景/吃/住/行)" floatingLabelFixed={true}value={r.category} onChange={(e) => {cache[index].route[i].category = e.target.value;this.setState({cache: cache})}}/>
						      			<div className='index'>{i+1}</div>
						      		</div>
						      		<div>
							      		<RaisedButton label="DELETE" primary={true} onTouchTap={() => {this._delete(index, i, cache)}}/>
							      		<RaisedButton style={{float: 'right'}} label="SAVE" primary={true} onTouchTap={this._save.bind(this)}/>
							      	</div>
						      	</div>
				      		))
				      	}
		      		</div>
				  	))
				  }
	  			</div>
	  	}
	  	</div>
  	)
  }
}

export default class App1 extends React.Component {
	render(){
		return(
			<HashRouter>
				<div>
			    <Route exact path="/" component={App}/>
			    <Route path="/a/1" component={App2}/>
		    </div>
			</HashRouter>
		)
	}
}

