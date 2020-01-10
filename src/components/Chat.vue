<template>
  <v-card class="elevation-0">
    <div v-if="!hasUsername">
      <v-card-title>
        Connect to chat.
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          placeholder="Enter a username"
          @keydown.enter="setUsername()"
        ></v-text-field>
        <v-btn class="ma-2" @click="setUsername()">
          Connect
        </v-btn>
      </v-card-text>
    </div>
    <div v-else>
      <v-card-title>
        Connected as {{ username }}
      </v-card-title>
      <v-card-text>
        <div
          v-for="chatMessage of chatMessages"
          :key="chatMessage.id"
        >
          <b>{{ getUsername(chatMessage.sender) }}:</b>
          {{ chatMessage.message}}
        </div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newChatMessage"
          placeholder="Send chat message"
          :autofocus="true"
          @keydown.enter="sendMessage()"
        ></v-text-field>
        <v-btn class="ma-2" @click="sendMessage()">
          Send
        </v-btn>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { registerCallback } from '../mixins/registerCallback';

export default {
  name: 'Chat',
  mixins: [registerCallback],
  data() {
    return {
      newChatMessage: '',
      username: '',
      hasUsername: false
    };
  },
  computed: {
    ...mapGetters({
      CHAT_MESSAGES: 'chatMessages/GET_COLLECTION'
    }),
    chatMessages() {
      return this.CHAT_MESSAGES ? this.CHAT_MESSAGES : [];
    }
  },
  mounted() {
    this.registerCallback('chatHistory', chatHistory => {
      this.$store.dispatch('chatMessages/RECEIVE_CHAT_HISTORY', chatHistory);
    });

    this.registerCallback('chatMessage', chatMessage => {
      this.$store.dispatch('chatMessages/RECEIVE_CHAT_MESSAGE', chatMessage);
    });
  },
  methods: {
    setUsername() {
      this.hasUsername = true;
    },
    getUsername(sender) {
      return sender === this.username ? 'You' : sender;
    },
    sendMessage() {
      this.$store.dispatch('chatMessages/SEND_MESSAGE', {
        messageType: 'chatMessage',
        messageData: {
          sender: this.username,
          message: this.newChatMessage
        }
      });
      this.newChatMessage = '';
    }
  }
};
</script>
