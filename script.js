   var User = Backbone.Model.extend({
        url: 'https://reqres.in/api/users',
        defaults:{
            id: null,
            first_name: 'John',
            last_name: 'Doe',
            avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'
        },

    });

   

    var UserList = Backbone.Collection.extend({
        model: User,
        url: 'https://reqres.in/api/users',

        parse: function(res){
         //console.log(res.data);
         var self = this;
         res.data.forEach((input, index) => {
            
            var person = new User({id: input.id, first_name: input.first_name, last_name: input.last_name, avatar: input.avatar});
            //console.log(person);
            self.push(person);
         });
         //console.log('length of collection is '+ this.length);
         return this.models;
        },

        initialize: function(){
            
        }

    });

    var UserView = Backbone.View.extend({
        tagName: 'li',


        events: {
         "click #editUser": "editUser",
        },

        template: _.template($('#user-template').html()),

        render: function(){
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        editUser: function(){
          console.log('editting user');
          $('li').removeClass("editting");
          this.$el.addClass("editting");
          $('.editForm').show();
          $('#addUserButton').hide();
          if(col.models.length<2){
            $('#confirmButton').hide();
         }
         console.log(this.model.attributes.id);
         document.getElementById("eid").innerHTML=('ID: '+this.model.attributes.id);
         $("#editId").val(this.model.attributes.id);
         $("#editFn").val(this.model.attributes.first_name);
         $("#editLn").val(this.model.attributes.last_name);
         
        },
    });
    var userView = new UserView();
    var col = new UserList();
    
    var App = Backbone.View.extend({

        el: '#container',

        events: {
            "click #addUserButton": "addModel",
            "click #deleteUserButton": "deleteModel",
            "click #saveEdit": "saveUser",
            "click #confirmButton": "confirm",
            "click #reloadButton": "redo",
        },
        
        initialize: function(){

            this.list = $('#users');
            $('.editForm').hide();
            $('.confirm').hide();
            
            col
            col.fetch({
               data: {
                  page: 1,
               },
            
               success: function(){
                  $('#users').html('');
                  //console.log(col.models.length);
                  col.models.forEach((mod) => {
                     var usr = new User(mod.attributes);
                     var view = new UserView({model: usr});

                     $('#users').append(view.render().el);
                  });          
               },
               reset: true,
            });

            this.listenTo(col, 'change', this.render);

            this.render();
        },

        render: function(){ 
         //console.log('rerendering items');
         $('#users').html('');
         
                  col.models.forEach((mod) => {
                     var usr = new User(mod.attributes);
                     var view = new UserView({model: usr});
                     $('#users').append(view.render().el);
                  });       
            return this;
        },

        addModel: function(){
         
         console.log('adding model');
         var mod = new User({id: col.models.length+1});
         console.log(mod);
         col.models.push(mod);
         alert('New user added to the bottom of the page');
         this.render();
        },
        deleteModel: function(){
         console.log('deleting model');
         var modl = col.models[($('#editId').val()) -1];
         col.remove(modl);
         $('.editForm').hide();
         $('.confirm').hide();
         $('#addUserButton').show();
         this.render();
         
        },
         saveUser: function(){
         console.log('saving user');
         console.log(col.models[($('#editId').val())-1]);
         var modl = col.models[($('#editId').val()) -1];

         if($("#editFn").val().length > 0 && $("#editLn").val().length > 0 ){
            console.log('hi')
         modl.set({'first_name': $("#editFn").val()});
         modl.set({'last_name': $("#editLn").val()});
         col.models[($('#editId').val()) -1] = modl;
         modl.save();
         $('.editForm').hide();
         $('#addUserButton').show();
         this.render();
         }else{
            alert('User must have first and last name property');
         }
        },
        confirm: function(){
         $('.editForm').hide();
         $('.confirm').show();
        },
        redo: function(){
         $('.editForm').show();
         $('.confirm').hide();
        }    
    });

    var app = new App();