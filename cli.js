#!/usr/bin/env node

var cli    = require('commander'),
    pck    = require('./package'),
    editor = require('editor'),
    fs     = require('fs'),
    md     = require('markdown');

cli
  .version(pck.version)
  .option('-p, --post [message]', 'Create a new blog post.')
  .option('-d, --delete', 'Delete a blog post.')
  .parse(process.argv);

function postMessage(message){
  console.log('Posting:');
  message = md.markdown.toHTML(message);
  console.log(message);
}

function post(message){
  var filename = '.bloj.tmp';

  if(message === true){
    editor(filename, function(code){
      if(code === 0){
        fs.readFile(filename, function(err, message){
          if(err){
            console.error(err);
            console.log('There was an error the temporary file is saved as %s', filename);
          }
          else{
            postMessage(message.toString());
            fs.unlink(filename);
          }
        });
      }
      else{
        console.error('Something went wrong. Errno: %d', code);
        console.log('The temporary file is saved as %s', filename);
      }
    });
  }
  else{
    postMessage(message);
  }
}

function del(){
  console.log('Deleting');
}

if(cli.post){
  post(cli.post);
}
else if(cli['delete']){
  del();
}
else{
  cli.outputHelp();
}

