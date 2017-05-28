import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    crearAvatar() {
      return this.transitionTo('editor');
    }
  }
});
