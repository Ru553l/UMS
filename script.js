   var User = Backbone.Model.extend({
        //url: 'https://reqres.in/api/users',
        defaults:{
            id: null,
            first_name: '',
            last_name: '',
            avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'
        },

    });

   

    var UserList = Backbone.Collection.extend({
        model: User,

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
          $('.editForm').show();
          if(col.models.length<2){
            $('#confirmButton').hide();
         }
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
            
            col.url='https://reqres.in/api/users';
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
         var mod = new User({id: col.models.length+1, first_name: $("#editFn").val(), last_name: $("#editLn").val()});
         console.log(mod);
         col.models.push(mod);
         this.render();
        },
        deleteModel: function(){
         console.log('deleting model');
         var modl = col.models[($('#editId').val()) -1];
         col.models.splice($('#editId').val()-1,1);
         $('.editForm').hide();
         $('.confirm').hide();

         this.render();
         
        },
         saveUser: function(){
         console.log('saving user');
         console.log(col.models[$('#editId').val()-1]);
         var modl = col.models[($('#editId').val()) -1];
         modl.set({'first_name': $("#editFn").val()});
         modl.set({'last_name': $("#editLn").val()});
         col.models[($('#editId').val()) -1] = modl;
         $('.editForm').hide();
         this.render();
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