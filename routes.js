const routes=require('next-routes')(); //function invoked immediately

//order of adding routes matters (parsing) 

//mapping for new campaign
routes.add('/campaigns/new','/campaigns/new');
//shows campaign on clicking view campaign
routes.add('/campaigns/:address','/campaigns/show'); 
//showing list of requests for each campaign
routes.add('/campaigns/:address/requests','/campaigns/requests/index');
//showing new request form
routes.add('/campaigns/:address/requests/new','/campaigns/requests/new');

module.exports=routes;

