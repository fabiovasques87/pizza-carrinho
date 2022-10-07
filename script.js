let cart = [];
let modalQt = 1; 
let modalkey = 0;


const c = (el)=> document.querySelector(el); //funcao anonima
const cs = (el)=> document.querySelectorAll(el);

//Listagem das pizzas

pizzaJson.map((item,index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true); //clona o item

    //preenche as informações das pizzas

    pizzaItem.setAttribute('data-key',index); //setar qual item foi clicado
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //formatar casa decimais
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    //captura a tag de link (a) e cancela a ação do click
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');  //pegar a info da pizza e colocar no modal,closest->encontre o elemento mais proximo

        modalQt = 1;
        modalkey =key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');    //remove a selecao do css
        cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex ==2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex'; //abrir modal que está como display none no css
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200);

    });

    c('.pizza-area').append(pizzaItem); //append serve para adicionar item
});

//Eventos do modal


function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{ //gerou um array com os itens do html
    item.addEventListener('click',closeModal);
}) 
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    
    }
    

});
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});

//controlar os tamanhos da pizza
cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        //desmarca primeiro as outras seleções
        c('.pizzaInfo--size.selected').classList.remove('selected');    //remove a selecao do css
        //selecionar o proprio item que se está clicando
        size.classList.add('selected');

    })
});

//add no carrinho
c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size =parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); 

    let identifier = pizzaJson[modalkey].id+'@'+size;

    //procurar se já possui o item no carrinho, no caso no array cart
    let key = cart.findIndex((item)=>item.identifier == identifier);

    //verificação se achou...
    if(key > -1){
        cart [key].qt += modalQt;
    }else {
    // console.log("pizza: " +modalkey);    
    cart.push({
        id:pizzaJson[modalkey].id,
        size,
        qt:modalQt
    });
}

    updateCart();
    closeModal();


});

//funcao para abrir o carrinho no mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


//função para add o carrinho    

 updateCart = ()=> {

    //ajustar o botao do carrinho no mobile
    c('.menu-openner span').innerHTML =cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show'); //abri o carrinho no desktop

        //zerar o item antes de adicionar
        c('.cart').innerHTML = '';

        //criacao de variaveis para valores do carrinho
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        //mapear o carrinho
        for(let i in cart){
            //acessar o pizza json e procurar dentro dele o id que temos
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            //pega o subtotal -> preco x a quantidade que tem no carrinho
            subtotal += pizzaItem.price * cart[i].qt;




            //clona o item
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;

                    case 1:
                        pizzaSizeName = 'M';
                        break;

                    case 2:
                        pizzaSizeName = 'G';
                        break;
                            
                        
            }

            //criação da variavel
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //adiciona a imagem da pizza no carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            //adiciona o nome no carrinho
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; //substitui por uma variavel
           //pega a quantidade
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; 

            //configurar os botoes de adicao e subtracao

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }   else{
                    cart.splice(i, 1); //remove um item do array do carrinho
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++; //encrementando o item especifico do contexto
                updateCart(); //vai reatualizar o carrinho toda vez quer pressionar o notao mais ou menos


            });

            //adiciona e exibe na tela
            c('.cart').append(cartItem);


            // console.log(pizzaItem);

            //calcula o subtotal x o 10% que é o desconto fixado
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            //entra na classe subtotal e seleciona o ultimo item de span  com last-child la do html
            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;



        }
    }else{
        c('aside').classList.remove('show');

        //fecha o carrinho no mobile
        c('aside').style.left = '100vw';
    }
}

// function updateCart (){
//         if(cart.length > 0){
//         c('aside').classList.add('.show');
//     }else{
//         c('aside').classList.remove('.show')
//     }
// }

