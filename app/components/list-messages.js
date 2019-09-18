import Component from '@ember/component';
import {inject as service} from '@ember/service';
import axios from 'npm:axios';
import Pusher from 'npm:pusher-js';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];
//ttry naming activeUSerSerivce something else to see if the names need to match from other components 

export default Component.extend({
    activeUserService: service('active-user'), // inject active-user service to set default message
    messages: ['Welcome to the chat app!'].map((message) => {
        return {
            username: 'Admin',
            time: new Date(),
            text: message
        };
    }),
    init(){
        //initial Pusher with keys 
        this._super(...arguments);
        let pusher = new Pusher('PUSHER_APP_KEY', {
            cluster: 'PUSHER_APP_CLUSTER',
            encrypted: true
        });
        //subscribe method is from pusher, create chat channel
        const channel = pusher.subscribe('chat');
        channel.bind('message', data => {
            const analysis =  data.sentiment === 0 ? HAPPY_EMOJI  : (data.sentiment === 0 ? NEUTRAL_EMOJI: SAD_EMOJI);
            const response = {
                text: data.text,
                username: data.username,
                time: data.time,
                mood: String.fromCodePoint(...analysis)
            }
            this.get('messages').pushObject(response);
        });
    }, 
    actions: {
        //receives the message posted by a user, their name, and the time and posts it to the server at /messages
        //triggered when the send button is clicked 
        newMessage() {
            const text = this.get('newMessage');
            const username = this.get('activeUserService').get('user');
            const time = new Date();

            axios.post('http://localhost:3000/messages', {
                text, username, time
            });
            this.set('newMessage', '');
        }
    }
});
