
function processScans() {
  try {
 _.initLogger(_.INFO, "Scans", "scan.log");


    _._d("Function getScans()");
    var label = "Scan"
    var folder = DriveApp.getFoldersByName("SamsungScans").next();
    
    var gmLabel = GmailApp.getUserLabelByName(label);
    if( gmLabel == null ) {
      throw { message: Utilities.formatString("Label not found") };
    } 

    _._d("Retrieving threads...")
    var gmThreads = gmLabel.getThreads();
    
    for (var i = 0; i < gmThreads.length; i++) {
      var thread = gmThreads[i];
      _._d("  - %s ", thread.getFirstMessageSubject());

      var messages = thread.getMessages();
      for(var j = 0; j < messages.length; j++) {
        _._d("    . Message %s ", j+1);
        
        var m = messages[j];
        var attachments = m.getAttachments();
        _._d("      . # Attachments: %s ", attachments.length);
        
        for( var k = 0; k < attachments.length; k++ ) {
          var a = attachments[k];
          _._d("        %s, Type: %s", k+1, a.getContentType());
          
          var name = Utilities.formatDate(m.getDate(), "CET", "yyyy-MM-dd HH:mm:ss");
          
          if( a.getContentType() == "application/pdf" ) {
          
            folder.createFile(a.copyBlob()).setDescription("Scan received via email").setName(name);
            _._i("Scan saved as '%s'", name);
            _.logInfoToFile("Scan saved as '%s'", name);
            
          }
          
          m.moveToTrash();
          
        }
        
      }
      
      
      
    }
    _._d("Done.")
    
    _._d("END getScans.");
    
  } catch( error ) {
    _._e("Error in getScans()\n  %s\n", error.message);
    _.logErrorToFile("Error in getScans()\n  %s\n", error.message);
    
  }
    
}

function createLogFile() {
 _.initLogger(_.INFO, "SamsungScans", "scan.log");
 _.logInfoToFile("Log file created");  
}
