let products=localStorage.getItem('products')
                ?JSON.parse(localStorage.getItem('products'))
                :[]
let mode='';
let source='all';
const title=document.querySelector('#title')
const id=document.querySelector('#id')
const price=document.querySelector('#price')
const taxes=document.querySelector('#taxes')
const ads=document.querySelector('#ads')
const discount=document.querySelector('#discount')
const category=document.querySelector('#category')
const count=document.querySelector('#count')

const total=document.querySelector('#total')
const btnSubmit=document.querySelector('#btn-submit')

const productsTable=document.querySelector('products-table')
const form=document.querySelector('.data-crud')
const tableBody=document.querySelector('#products-table tbody');
const productInfo=document.querySelector('#products-info span');

const searchInput=document.querySelector('#search-input')
const searchTitle=document.querySelector('#search-title')
const searchCategory=document.querySelector('#search-category')

function raz(){
    title.value=""
    price.value=""
    taxes.value=""
    ads.value=""
    discount.value=""
    count.value=""
    category.value=""
    total.textContent=""
}
class Product{
    constructor(id, title, price, taxes, ads, discount, category){
        this.id=id,
        this.title=title;
        this.price=price;
        this.taxes=taxes?taxes:0;
        this.ads=ads?ads:0;
        this.discount=discount?discount:0;
        this.total=0;
        this.count=1,
        this.category=category;
    }
    static getTotalPrice(){
        if(price.value!=""){
            total.innerHTML=+price.value+ +taxes.value+ +ads.value- +discount.value
            total.style.background='#0F0';
        }else{
            total.style.background='ef1919';
        }
    }
    getTotal(){
        return this.price+this.taxes+this.ads-this.discount
    }
    createProduct(){
        products.push({
            id:this.id,
            title:this.title,
            price:this.price,
            taxes:this.taxes,
            ads:this.ads,
            discount:this.discount,
            total:this.total,
            count:this.count,
            category:this.category,
        })
        this.saveData();
        
    }
    
    removeProduct(id){
        if(confirm('delete this records!are you sure?')){
            products=[...products.filter(el=>el.id!=id)];
            console.log('products ==', products)
            this.saveData()        
            Product.displayData()
        }
    }
    static removeAllProducts(){
        
        if(confirm('are you sure to remove all record?')){
            products=[];
            const prod=new Product()
            prod.saveData()
            Product.displayData()
        }
    }
    updateProduct(id,title,price,taxes,ads,discount,category){
        products=[...products.map(el=>el.id==id
                            ?{id,title, price,taxes, ads, discount,total:price+taxes+ads-discount,count:1,category}
                            :el
            )
        ]
        this.saveData()
        Product.displayData()
        
    }
    editProduct(prod){
        mode='edit'
        id.value=prod.id;
        title.value=prod.title;
        price.value=prod.price;
        taxes.value=prod.taxes;
        ads.value=prod.ads;
        discount.value=prod.discount;
        total.textContent=prod.total;
        count.value=prod.count;
        category.value=prod.category
        btnSubmit.textContent="Update"
    }
    
    saveData(){
        localStorage.setItem('products',JSON.stringify(products))
    }
    removeTableContent(){
        tableBody.innerHTML=''
    }

    static sourceData(input,type){
        if(type==='title') {
            source='title';
        }
        else if(type==='category') {
            source='category';            
        }
        else {
            source='all';            
            
        }
        
        Product.displayData()
    }

    
    static displayData(){
        const prod=new Product()
        prod.removeTableContent()
        let arr=[]
        if(source=='title'){
            arr= products.filter(el=>el.title==searchInput.value)
        }
        else if(source=='category')
            arr=products.filter(el=>el.category==searchInput.value)
        else {
            arr= products
        }

        arr.forEach(el=>{
            const tr=document.createElement('tr')
            
            for(let item in el){
                const td=document.createElement('td')
                const tdTxt=document.createTextNode(el[item])
                td.appendChild(tdTxt)
                tr.appendChild(td)
            }
            
            const td2=document.createElement('td')
            td2.style.display='flex'
            td2.style.gap='10px'
            td2.style.justifyContent='center'
            const btn=document.createElement('button')
            btn.classList.add('btn-action')
            const btnTxt=document.createTextNode("Edit")
            const btn2=document.createElement('button')
            btn2.classList.add('btn-action')
            btn.onclick=function(){prod.editProduct(el)}
            btn2.onclick=function(){prod.removeProduct(el.id)}
            const btnTxt2=document.createTextNode("Del")
            btn.appendChild(btnTxt)
            btn2.appendChild(btnTxt2)
            td2.appendChild(btn)
            td2.appendChild(btn2)
            tr.appendChild(td2)

            tableBody.appendChild(tr)
        })
        productInfo.textContent=arr.length<10
                                    ?'0'+arr.length
                                    :arr.length;       
    }
}


btnSubmit.onclick=function(e){
    
    e.preventDefault();
    if(title.value==""){
        
        document.querySelector('#title + span').classList.remove('error-inactive');
        document.querySelector('#title + span').innerHTML='the title must not be empty';
    }
    else if(price.value==""){
        document.querySelector('#title + span').classList.add('error-inactive');
        document.querySelector('#price + span').classList.remove('error-inactive');
        document.querySelector('#price + span').innerHTML='the price must not be empty';
    }
    else{
    
        document.querySelector('#title + span').classList.add='error-inactive';
    
        document.querySelector('#price + span').classList.add='error-inactive';
        
        if(count.value=="" || +count.value==1){
            console.log('mode ===', mode)
            if(mode=='edit'){
                let prod=new Product()
                prod.updateProduct(
                    +id.value,
                    title.value,
                    +price.value,
                    +taxes.value,
                    +ads.value,
                    +discount.value,
                    category.value
                    );
                    
                    prod.total=prod.getTotal();
                    Product.displayData();
                    mode=''
                }else{
                    let prod=new Product(
                        products.length
                            ?Math.max(...products.map(el=>el.id))+1
                            :1,
                        document.querySelector('#title').value,
                        +document.querySelector('#price').value,
                        +document.querySelector('#taxes').value,
                        +document.querySelector('#ads').value,
                        +document.querySelector('#discount').value,
                        document.querySelector('#category').value
                        );
                        
                        prod.total=prod.getTotal();
                        prod.createProduct();
                        Product.displayData()
                }
            
            }
            else{
                for(let i=0; i< parseInt(count.value);i++){
                    let prod=new Product(
                        products.length
                            ?Math.max(...products.map(el=>el.id))+1
                            :1,
                        document.querySelector('#title').value,
                        +document.querySelector('#price').value,
                        +document.querySelector('#taxes').value,
                        +document.querySelector('#ads').value,
                        +document.querySelector('#discount').value,
                        document.querySelector('#category').value
                        );
                 
                        prod.total=prod.getTotal();
                        prod.createProduct();
                        
                    }
                    raz();       
                    Product.displayData()
            }
    }
console.log('products =',products) 
}

searchInput.onkeyup=()=>{
    if(searchInput.value=='') {
        source='all'
        Product.displayData()
    }
}

Product.displayData()