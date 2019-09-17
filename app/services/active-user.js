import Service from '@ember/service';
//responsible for storing the user's name before they can start chatting 

export default Service.extend({

    user: null,
    setUser(username) {
        this.set('user', username);
    },
    hasUser(){
        return this.get('user') != undefined; //logged in or not? //true if they are active
    }
});
