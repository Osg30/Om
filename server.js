var express=require("express");
var fileUploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;
var nodemailer=require("nodemailer");
var mysql2=require("mysql2");
const { json } = require("stream/consumers");
var app=express();

app.listen(2004,function(){
    console.log("Server Started Horray ***");
});

app.use(express.static("public"));



app.use(express.urlencoded(true)),

app.use(fileUploader());

let dbConfig="mysql://avnadmin:AVNS_LqIcUBr3uWt83PwBDmD@mysql-14aaa479-omsharanaggarwal.i.aivencloud.com:16217/defaultdb";

let mySqlServer=mysql2.createConnection(dbConfig);

mySqlServer.connect(function(err){
    if(err!=null)
    {
        console.log(err.message);
    }
    else
        console.log("Connected to Database Horray ***")
    
});

cloudinary.config({
    cloud_name: 'dqaog13dw',
    api_key: '695548834373351',
    api_secret: 'RCfeTY7DwniMPDQ3IlXefAosu94'
});



app.get("/",function(req,resp){
    //resp.send("this is project")
    
    // resp.write("Hello guys");
    // resp.end();
    let fullpath=path+"/index.html";
    resp.sendFile(fullpath);
});

let news=__dirname;
let path=news+"/public";

app.get("/signup",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/signup.html";
    resp.sendFile(fullpath);
    // resp.sendFile(__dirname+"/public/signup.html")
});

app.get("/admin-dash",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/admin-dash.html";
    resp.sendFile(fullpath);
    // resp.sendFile(__dirname+"/public/signup.html")
});

app.get("/vol",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/vol-kyc.html";
    resp.sendFile(fullpath);
    // resp.sendFile(__dirname+"/public/vol-kyc.html")
});

app.get("/vol-dash",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/vol-dash.html";
    resp.sendFile(fullpath);
});

app.get("/client",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/client-profile.html";
    resp.sendFile(fullpath);
});

app.get("/client-dash",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/client-dash.html";
    resp.sendFile(fullpath);
});

app.get("/publish-job",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/publish-job.html";
    resp.sendFile(fullpath);
});

app.get("/job-available",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/job-available.html";
    resp.sendFile(fullpath);
});

app.get("/job-manager",function(req,resp){
    console.log(req.query);
    let fullpath=path+"/job-manager.html";
    resp.sendFile(fullpath);
});


app.get("/save-sign",function(req,resp){
    console.log(req.query);
    mySqlServer.query("Insert into users Values (?,?,?,CURDATE(),?)",[req.query.x, req.query.y, req.query.z,'1'],function(err){
        if(err ==null)
            resp.send("Record Saved Successfully Horray...");
        else
        {
           resp.send(err.message);
           
        }
    });
});


app.get("/save-log",function(req,resp){

    console.log(req.query.x1);
    mySqlServer.query("select * from users where emailid=? and pwd=? and startus=?", [req.query.x1,req.query.y1,'1'], function(err,jsonarray){
       if(jsonarray.length==0)
        {
            resp.send("invalid user");
        }  

        else
        {
            console.log(jsonarray[0]["utype"]);
            let fullpath=path+"/client-dash.html";
            // resp.sendFile(fullpath);
            resp.send(jsonarray[0]["utype"]);
            // if(jsonarray[0]["utype"]=='Client')
            // {
                
                
            //     let fullpath=path+"/client-dash.html";
            //     resp.sendFile(fullpath);
            // }
        }
        
    })
})


app.get("/add-job",function(req,resp){
    console.log(req.query);
    val1=req.query.my1;
    val2=req.query.my2;
    val3=req.query.my3;
    val4=req.query.my4;
    val5=req.query.my5;
    val6=req.query.my6;
    val7=req.query.my7;



    mySqlServer.query('Insert into jobs(cid,contact,jobtitle,jobtype,address,city,edu) Values (?,?,?,?,?,?,?)',[val1,val2,val3,val4,val5,val6,val7],function(err){
        if(err ==null)
        {
            resp.send("Record Saved Successfully Horray...");
            console.log("Saved");
        }
            


        else
        {
           resp.send(err.message);
           console.log(err.message);           
        }
    });
});



app.post("/vol-prosave",async function(req,resp)
{
    let txtemail=req.body.txtemail;
    let txtname=req.body.txtname;
    let txtcontact=req.body.txtcontact;
    let txtaddress=req.body.txtaddress;
    let txtcity=req.body.txtcity;
    let txtgender=req.body.txtgender;
    let txtdob=req.body.txtdob;
    let txtquali=req.body.txtdobquali;
    let txtoccu=req.body.txtoccu;
    let txtother=req.body.txtother;

    let filename;
    let fileplace;

    // try{
    // console.log(req.query);
    //             let fullpath=path+"/vol-dash.html";
    //             resp.sendFile(fullpath);
    //         }
    //         catch(err)
    //         {
    //             console.log(err.message)
    //         }

    if(req.files!=null)
    {
        filename=req.files.ppic.name;
        fileplace=req.files.idpic.name;

        let locationToSave=__dirname+"/public/uploads/"+filename;//full ile path
        let locToSave=__dirname+"/public/uploads/"+fileplace;

        req.files.ppic.mv(locationToSave);//saving file in uploads folder
        req.files.ppic.mv(locToSave);

        try{
            //saving ur file/pic on cloudinary server
            await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
                filename=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
                console.log(filename);
            });
        }
        catch(err)
        {
            resp.send(err.message);
        }
        try{
            await cloudinary.uploader.upload(locToSave).then(function(picUrlResult){
            fileplace=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileplace);
            });
        }
        catch(err)
        {
            resp.send(err.message);
        }
    }
    else
    {
        filename="nopic.jpg";
        fileplace="nopic.jpg";
    }

    mySqlServer.query("insert into volkyc values(?,?,?,?,?,?,?,?,?,?,?,?)",[txtemail,txtname,txtcontact,txtaddress,txtcity,txtgender,txtdob,txtquali,txtoccu,txtother,filename,fileplace],function(err)
    {
            if(err==null)
            {
                // resp.send("Record Saved Successsfulllyyy.. Badhaiiii");
                console.log("Saved"); 
                // app.get("/vol-dash")
                            
                
            }
            else
            {
                resp.send(err.message);
                console.log("Error"); 
                

            }
                

    });

    
    
    
});



app.get("/all-records",function(req,resp)
{
    mySqlServer.query("select * from jobs",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/current-records",function(req,resp)
{
    let userMail=req.query.active;
    console.log(userMail);
    mySqlServer.query("select * from jobs where cid=",[userMail],function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/do-delete-one",function(req,resp)
{
    let userMail=req.query.emailKuch;
                                                  //col name Same as  table col name
    mySqlServer.query("delete from jobs where jobid=?",[userMail],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Record Deleted Successfulllyyyy");
            else
            resp.send("Inavlid User Id");
        }
        else
        resp.send(err.message);
    })
})

app.get("/do-fetch-1",function(req,resp)
{
    console.log(req.query)
    if(req.query.emailKuch=="All")
        query="select * from jobs";
    else
        query="select * from jobs where cid=?";
    mySqlServer.query(query,[req.query.emailKuch],function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})




// app.post("/do-update",async function(req,resp)
// {
//     let txtEmail=req.body.txtEmail;
//     let txtPwd=req.body.txtPwd;
//     let txtDob=req.body.txtDob;

//     let fileName;
//     if(req.files!=null)
//     {
//         fileName=req.files.ppic.name;
//         let locationToSave=__dirname+"/public/uploads/"+fileName;//full ile path
//         req.files.ppic.mv(locationToSave);//saving file in uploads folder

//          //saving ur file/pic on cloudinary server
//          try{
//          await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
//             fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
//             console.log(fileName);
//             });
//         }
//         catch(err)
//         {
//             resp.send(err.message);
//         }

//     }
//     else
//     fileName="nopic.jpg";

//     mySqlServer.query("update curdTable set pwd=?, dob=?, picurl=? where email=?",[txtPwd,txtDob,fileName,txtEmail],function(err,result)
//     {
//             if(err==null)
//             {
//                 if(result.affectedRows==1)
//                     resp.send("Record Update Successsfulllyyy.. Badhaiiii");
//                 else
//                     resp.send("Invalid Email ID");
//             }
//             else
//             resp.send(err.message);
//     });
// });




// app.get("/job-records",function(req,resp)
// {
//     mySqlServer.query("select * from jobs",function(err,result)
//     {
//         console.log(result);
//         resp.send(result);
//     });
// });

// app.get("/do-delete-one",function(req,resp)
// {
//     let userMail=req.query.emailKuch;
//     //col name Same as  table col name
//     mySqlServer.query("delete from jobs where cid=?",[userMail],function(err,result)
//     {
//         if(err==null)
//         {
//             if(result.affectedRows==1)
//             resp.send("Record Deleted Successfulllyyyy");
//             else
//             resp.send("Inavlid User Id");
//         }
//         else
//         resp.send(err.message);
//     });
// });

// app.get("/do-fetch-1",function(req,resp)
// {
//     console.log(req.query)
//     if(req.query.emailKuch=="All")
//         query="select * from jobs";
//     else
//         query="select * from jobs where cid=?";
//     mySqlServer.query(query,[req.query.emailKuch],function(err,result)
//     {
//         console.log(result);
//         resp.send(result);
//     });
// });








