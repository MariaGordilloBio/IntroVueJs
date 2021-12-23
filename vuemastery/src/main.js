import Vue from 'vue'
import App from './App.vue'

//Vue instance é a raíz de toda aplicação Vue
 //Vue instance se liga ao elemento na DOM
//Criar um componente - ARVORE DE COMPONENTES

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
   <div class="product">
        
      <div class="product-image">
        <img :src="image" />
      </div>

      <div class="product-info">
          <h1>{{ product }}</h1>
          <p v-if="inStock">Produto disponível</p>
          <p v-else>Produto indisponível</p>
          <p>Valor: {{ shipping }}</p>

          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>

          <div class="color-box"
               v-for="(variant, index) in variants" 
               :key="variant.variantId"
               :style="{ backgroundColor: variant.variantColor }"
               @mouseover="updateProduct(index)"
               >
          </div> 

          <button v-on:click="addToCart" 
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
            >
          Adicione ao carrinho
          </button>

          <button @click="removeFromCart" 
            >
          Remova do carrinho
          </button>

       </div>  
<div>
            <p v-if="!reviews.length">Ainda não existem opiniões sobre o produto.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
       
       <product-review @review-submitted="addReview"></product-review>
    
    </div>
   `,
// data é agora uma função - componente reutilizável
  data() {
    return {
        product: 'Meias',
        brand: 'Vue Mastery',
        selectedVariant: 0,
//0 - colocando-se baseado no index que clicar        
        details: ['80% algodão', '20% poliéster', 'Gênero-neutro'],
        variants: [
          {
            variantId: 2234,
            variantColor: 'green',
            variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
            variantQuantity: 10     
          },
          {
            variantId: 2235,
            variantColor: 'blue',
            variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
            variantQuantity: 0     
          }
        ],
        reviews: []
    }
  },
    methods: {
      addToCart: function() {
//esse método emit anuncia que o evento de clique acabou de acontecer       
          this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
      },
      updateProduct: function(index) {  
          this.selectedVariant = index
      },
      removeFromCart: function() {         
           this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
      },
      addReview(productReview) {
        this.reviews.push(productReview)
      }
    },
//Computed properties calculam o valor ao invés de guardar o valor - usa variant's quantities
//Computed properties pode usar dado da aplicação para calcular seus valores
        title() {
            return this.product + ' ' + this.brand 
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
//alcança o primeiro ou segundo elemento na array, depois usa-se dot notation para alcançar a imagem 
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
          if (this.premium) {
            return "Gratuito"
          }
            return 12.99
        }
    }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
    
      <p class="error" v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
<!--v-model directive gives us this two-way binding-->        
        <label for="name">Nome:</label>
        <input id="name" v-model="name">
      </p>
      
      <p>
          <label for="review">Opinião:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Nota:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Recomendaria esse produto?</p>
      <label>
        Sim
        <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label>
        Não
        <input type="radio" value="No" v-model="recommend"/>
      </label>
          
      <p>
        <input type="submit" value="Enviar">  
      </p>    
    
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
 methods: {
//Validate submit     
    onSubmit() {
      this.errors = []
      if(this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        this.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      } else {
        if(!this.name) this.errors.push("Name required.")
        if(!this.review) this.errors.push("Review required.")
        if(!this.rating) this.errors.push("Rating required.")
        if(!this.recommend) this.errors.push("Recommendation required.")
      }
    }
  }
})

var app = new Vue({
    el: '#app',
    data: {
      premium: true,
      cart: []
    },
    methods: {
      updateCart(id) {
        this.cart.push(id)
      },
      removeItem(id) {
        for(var i = this.cart.length - 1; i >= 0; i--) {
          if (this.cart[i] === id) {
             this.cart.splice(i, 1);
          }
        }
      }
    }
})

//Props are used to pass data from parent to child