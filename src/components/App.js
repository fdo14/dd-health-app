import React from 'react';
import {TimelineMax, TweenLite, TweenMax} from "gsap/TweenMax";
import {Elastic, Back, Power1, Bounce} from "gsap/all";
import $ from 'jquery';

import './figures/figures.css';

class App extends React.Component{
  state = { startingHealth: null, attack: null, currentHealth: null, renderWarrior: false, dead: false, healing: false, heals: null, waiting: false}
  componentDidMount(){
    var bgd = $('#background rect');
    var tl = new TimelineMax();
    tl.from(bgd, 0.1, {opacity:0, scale:0, transformOrigin: 'center center'})
        .staggerFrom('#text', 1, {opacity: 0, scale: 0, transformOrigin: 'center center', ease: Back.easeOut}, 0.2)
        .staggerFrom('#startingHealth', 1, {opacity: 0, scale: 0, transformOrigin: 'center center', ease: Back.easeOut}, 0.2)
  }

  componentDidUpdate(){
    console.log('hey');
  }

  onInputChange = event => {
    this.setState({startingHealth: event.target.value});
    this.setState({currentHealth: event.target.value});
    this.setState({renderWarrior: true});
  };

  onAttackChange = event => {
    this.setState({attack: event.target.value});
  };

  onHealChange = event => {
    this.setState({heals: event.target.value});
  };

  onSubmitForm = event => {
    event.preventDefault();
    let startingHealth = parseFloat(this.state.startingHealth);
    if(this.state.startingHealth && Number.isInteger(startingHealth)){
      var tl = new TimelineMax();
         tl.add( TweenMax.to('#startingHealth', .2, { opacity: 0 , ease:Power1.easeInOut}) );
         tl.add( TweenMax.to('#text', .2 , { y: -150 , ease:Power1.easeInOut}) );
         tl.add( TweenMax.to(['#warrior', '#attackButton', '#healButton', '#progressBar'], .7 , { opacity: 1 , ease:Power1.easeInOut}) );
    }
  }

  renderForm(){
    return(
      <form onChange={this.onInputChange} onSubmit={this.onSubmitForm}>
        <div class="ui huge form">
          <div class="field">
            <input class="health" placeholder="Health" type="text" />
          </div>
        </div>
      </form>
    );
  }

  renderAttackButton(){
    if(this.state.renderWarrior){
      return(
        <form onSubmit={this.onAttackSubmit} onChange={this.onAttackChange}>
          <div class="ui left action input" >
            <button class="ui red labeled icon button pixel">
              <i class="fas fa-skull-crossbones"></i>
              Attack
            </button>
            <input type="text" class="pixel" placeholder="Damage" value={this.state.attack}/>
          </div>
        </form>
      );
    }
  }

  renderHealButton(){
    if(this.state.renderWarrior){
      return(
        <form onSubmit={this.onHealSubmit} onChange={this.onHealChange}>
          <div class="ui left action input" >
            <button class="ui teal labeled icon button pixel">
            <i class="fa fa-heart "></i>
             Healing
            </button>
            <input class="pixel" type="text" placeholder="Heal" value={this.state.heals}/>
          </div>
        </form>
      );
    }
  }

  renderWarrior(){
    if(this.state.renderWarrior){
      return(
        <React.Fragment>
          <foreignObject id="warrior" x="450" y="225" className="warrior"></foreignObject>
          <g id="healsWrapper" ><foreignObject id="heals" x="440" y="240" className="heals"></foreignObject></g>
          <g id="catMageWrapper" ><foreignObject id="catMage" x="600" y="100" className="catMage"></foreignObject></g>
          <g id="minotaurWrapper" ><foreignObject id="minotaur" x="400" y="25" className="minotaur"></foreignObject></g>
          <g id="mageWrapper" ><foreignObject id="mage" x="650" y="100" className="mage"></foreignObject></g>
          <g id="beastWrapper" ><foreignObject id="beast" x="600" y="50" className="beast"></foreignObject></g>
          <g id="fighterWrapper" ><foreignObject id="fighter" x="600" y="50" className="fighter"></foreignObject></g>
        </React.Fragment>
      );
    }
  }

  onAttackSubmit = event => {
    event.preventDefault();

    let attack = parseFloat(this.state.attack);
    if(this.state.attack && Number.isInteger(attack) && attack !== 0 && !this.state.waiting){
      this.attack();
      this.setState({attack: 0})
    }
  }

  onHealSubmit = event => {
    event.preventDefault();

    let heal = parseFloat(this.state.heals);
    if(this.state.heals && Number.isInteger(heal) && heal !== 0 && this.state.currentHealth !== this.state.startingHealth && !this.state.waiting){
      this.heal();
      this.setState({heals: 0})
    }
  }


  attacker = () => {
    var tl = new TimelineMax();
    const ids = ['attacker', 'catMage', 'minotaur', 'mage', 'beast', 'fighter']
    var index = Math.floor(Math.random() * ids.length);
    let id = ids[index]
    if(id === "attacker"){
      tl.add( TweenMax.to(`#${id}`, .2, { opacity: 1 , ease:Power1.easeInOut}) );
      tl.add( TweenMax.to(`#${id}Wrapper`, 1, { x:-650 , ease:Power1.easeInOut}) );
      tl.add( TweenMax.to(`#${id}`, 1, { opacity: 0 , ease:Power1.easeInOut}) );
      tl.add( TweenMax.to(`#${id}Wrapper`, 1, { x:0 , ease:Power1.easeInOut}) );
      document.getElementById(`${id}`).style.animationPlayState = "running";
    } else if(id === "catMage" || id === "minotaur" || id === 'mage' || id === 'beast' || id === 'fighter'){
      tl.add( TweenMax.to(`#${id}`, .5, { opacity: 1 , ease:Power1.easeInOut}) );
      setTimeout(function(){
        document.getElementById(`${id}`).style.animationPlayState = "running";
      }, 600);
      setTimeout(function(){
        tl.add( TweenMax.to(`#${id}`, .5, { opacity: 0 , ease:Power1.easeInOut}) );
      }, 2000);

    }
    return id;
  }

  attackerHide = (idToHide) => {
    setTimeout(function(){
      document.getElementById(idToHide).style.animationPlayState = "paused";
      let elm = document.getElementById(idToHide);
      let newone = elm.cloneNode(true);
      elm.parentNode.replaceChild(newone, elm);
    }, 3000);
  }

  attack = async () => {
    this.setState({waiting: true})

    document.getElementById("warrior").style.animationDirection = "normal";
    var i = 0;
    if(i > 0){
      var damageDealt = (this.state.currentHealth/this.state.startingHealth)*1999
      let elm2 = document.getElementById("warrior")
      let newone2 = elm2.cloneNode(true)
      elm2.parentNode.replaceChild(newone2, elm2)
      document.getElementById("warrior").style.animationDelay = `-${1999-damageDealt}ms`
      document.getElementById("warrior").style.animationDirection = `normal`
    }

    if(this.state.currentHealth == 0){
      this.setState({dead: true})
    }

    let damage = (this.state.attack / this.state.startingHealth) *1999;
    console.log(damage);
    if(damage > (this.state.currentHealth / this.state.startingHealth) *1999){
       damage = (this.state.currentHealth / this.state.startingHealth) *1999;
    }

    await this.setState({currentHealth: this.state.currentHealth - this.state.attack})

    if(this.state.currentHealth < 0){
      this.setState({currentHealth: 0})
    }

    if(!this.state.dead){
      let idToHide = this.attacker();
      setTimeout(function(){
        document.getElementById("warrior").style.animationPlayState = "running";
        setTimeout(function(){
          document.getElementById("warrior").style.animationPlayState = "paused";
        }, damage)
      }, 1300);

      this.attackerHide(idToHide);

      damageDealt = (this.state.currentHealth/this.state.startingHealth)*1999
      setTimeout(function(){
        let elm2 = document.getElementById("warrior")
        let newone2 = elm2.cloneNode(true)
        elm2.parentNode.replaceChild(newone2, elm2)
        document.getElementById("warrior").style.animationDelay = `-${1999-damageDealt}ms`
        this.setState({waiting: false})
      }.bind(this), 4000);
    }
    i++;

  }

  heal = () => {
    var healingDone = (this.state.currentHealth/this.state.startingHealth)*1999
    let elm = document.getElementById("warrior");
    let newone = elm.cloneNode(true);
    elm.parentNode.replaceChild(newone, elm);
    document.getElementById("warrior").style.animationDelay = `-${healingDone}ms`;
    document.getElementById("warrior").style.animationDirection = "reverse";

    var healing = parseInt(this.state.heals, 10)
    if((parseFloat(healing) + parseFloat(this.state.currentHealth))> this.state.startingHealth){
      healing = this.state.startingHealth - this.state.currentHealth
    }
    this.setState({currentHealth: this.state.currentHealth + healing});
    this.state.currentHealth = healing + this.state.currentHealth;
    healing = (healing / this.state.startingHealth) *1999;

    var tl = new TimelineMax();
      tl.add( TweenMax.to('#heals', 0, { opacity: 1 , ease:Power1.easeInOut}) );
      tl.add( TweenMax.to('#heals', 1.5, { opacity: 0 , ease:Power1.easeInOut}) );
    document.getElementById("heals").style.animationPlayState = "running";

    document.getElementById("warrior").style.animationPlayState = "running";
    setTimeout(function(){
      document.getElementById("warrior").style.animationPlayState = "paused";
    }, healing)

    healingDone = (this.state.currentHealth/this.state.startingHealth)*1999

    setTimeout(function(){
      document.getElementById("heals").style.animationPlayState = "paused";
      let elm = document.getElementById("heals");
      let newone = elm.cloneNode(true);
      elm.parentNode.replaceChild(newone, elm);
    }, 3000);

    setTimeout(function(){
      let elm = document.getElementById("warrior");
      let newone = elm.cloneNode(true);
      elm.parentNode.replaceChild(newone, elm);
      document.getElementById("warrior").style.animationDelay = `-${1999-healingDone}ms`;
      document.getElementById("warrior").style.animationDirection = "normal";
    }, healing);
  }

  renderProgress(){
    if(this.state.renderWarrior){
      return(
        <div class="w3-light-grey w3-round">
          <div class="w3-container w3-blue w3-round" style={{width:`${(this.state.currentHealth/this.state.startingHealth)*100}%`}}>{this.renderHealth()}</div>
        </div>
      )
    }
  }

  renderHealth(){
    if(this.state.currentHealth === 0){
      return "Death becomes you";
    } else return `${this.state.currentHealth} hitpoints remaining`;
  }

  render(){
    return(
      <div>
        <svg id="dd" className="body" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  width="100vw"  height="100vh" viewBox="0 0 1200 900"  xmlSpace="preserve">
          <g id="startingHealth">
            <foreignObject x="540" y="400" width="170" height="80" >
              {this.renderForm()}
            </foreignObject>
          </g>

          <g id="attackButton">
            <foreignObject x="100" y="380" width="300" height="80" >
              {this.renderAttackButton()}
            </foreignObject>
          </g>
          <g id="progressBar">
            <foreignObject x="275" y="650" width="700" height="80" >
              {this.renderProgress()}
            </foreignObject>
          </g>

          <g id="healButton">
            <foreignObject x="100" y="480" width="300" height="80" >
              {this.renderHealButton()}
            </foreignObject>
          </g>

          <g id="text"><foreignObject class="text" x="375" y="280" width="390" height="80" ></foreignObject>
          </g>
          {this.renderWarrior()}

          <g id="attackerWrapper" ><foreignObject id="attacker" x="1200" y="300" className="attacker"></foreignObject></g>



        </svg>
      </div>
    );
  }
}

export default App;
