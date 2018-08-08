/*
	Blockchain-based Electronic Lab Notebook
	UNIST 2018 Spring Semester - Project Lab.
		SEOKJU HAHN
*/

/*
	Create toy data (demo)
    @param {labnotebook.blockchain.setupDemo} demo
    @transaction
*/
function setupDemo(demo)
{
	var factory = getFactory();
    var NS = 'labnotebook.blockchain';
  	
    var ProjectID = "BELN001";
    var whenCreated = demo.timestamp;
    whenCreated.setDate(whenCreated.getDate());

    // Create new researchers
    var researcher1 = factory.newResource(NS, 'researcher', 'R001');
    var r_name1 = factory.newConcept(NS, 'Name');
    r_name1.firstName = 'Seokju';
    r_name1.lastName = 'Hahn';
    researcher1.name = r_name1;
    researcher1.Organization = 'UNIST';
    researcher1.Position = 'MS';

    var researcher2 = factory.newResource(NS, 'researcher', 'R002');
    var r_name2 = factory.newConcept(NS, 'Name');
    r_name2.firstName = 'Hyunkeol';
    r_name2.lastName = 'Noh';
    researcher2.name = r_name2;
    researcher2.Organization = 'UNIST';
    researcher2.Position = 'MS';

    // Create new inspectors
    var inspector1 = factory.newResource(NS, 'inspector', 'I001');
    var i_name1 = factory.newConcept(NS, 'Name');
    i_name1.firstName = 'Mooje';
    i_name1.lastName = 'Cho';
    inspector1.name = i_name1;
    inspector1.Organization = 'UNIST';
    inspector1.Position = 'INSPECTOR';

    var inspector2 = factory.newResource(NS, 'inspector', 'I002');
    var i_name2 = factory.newConcept(NS, 'Name');
    i_name2.firstName = 'Mooyoung';
    i_name2.lastName = 'Jung';
    inspector2.name = i_name2;
    inspector2.Organization = 'UNIST';
    inspector2.Position = 'INSPECTOR';

    // Create new officers
    var officer1 = factory.newResource(NS, 'officer', 'O001');
    var o_name1 = factory.newConcept(NS, 'Name');
    o_name1.firstName = 'Hyeran';
    o_name1.lastName = 'Park';
    officer1.name = o_name1;
    officer1.Organization = 'UNIST';
    officer1.Position = 'Research Center Officer';

    var officer2 = factory.newResource(NS, 'officer', 'O002');
    var o_name2 = factory.newConcept(NS, 'Name');
    o_name2.firstName = 'Minju';
    o_name2.lastName = 'Kim';
    officer2.name = o_name1;
    officer2.Organization = 'UNIST';
    officer2.Position = 'Research Center Officer';

    // Create a new head
    var head = factory.newResource(NS, 'head', 'H001');
    var h_name = factory.newConcept(NS, 'Name');
    h_name.firstName = 'Comuzzi';
    h_name.lastName = 'Marco';
    head.name = h_name;
    head.Organization = 'UNIST';
    head.Position = 'PI';  

    var newBLN = factory.newResource(NS, 'LabNotebook', ProjectID);
    var rArr = [];
    var iArr = [];
    var oArr = [];
    var hArr = [];

    rArr.push(researcher1); rArr.push(researcher2);
    iArr.push(inspector1); iArr.push(inspector2);
    oArr.push(officer1); oArr.push(officer2);
    hArr.push(head);

    newBLN.cumulPages = 1;
    newBLN.StartDate = whenCreated;

    var Researcher = factory.newRelationship(NS, 'researcher', rArr);
    var Officer = factory.newRelationship(NS, 'officer', oArr);
    var Inspector = factory.newRelationship(NS, 'inspector', iArr);
    var Head = factory.newRelationship(NS, 'head', hArr);

    newBLN.Researcher = [Researcher];
    newBLN.Officer = [Officer];
    newBLN.Inspector = [Inspector];
    newBLN.Head = [Head];
    newBLN.oStatus = 'UNDEFINED';
    newBLN.iStatus = 'UNDEFINED';

    // Create an initial NotebookPage
    var mother = factory.newRelationship(NS, 'LabNotebook', ProjectID);
    var pgID = ProjectID + '_1';
    var newPage = factory.newResource(NS, 'NotebookPage', pgID);

    newPage.PageNum = 1;
    newPage.Status = 'UNDEFINED';
    newPage.WroteDate = whenCreated;

    var Advisor = factory.newRelationship(NS, 'head', hArr);
    newPage.Advisor = [Advisor];
    newBLN.firstPage = [newPage];

    return getAssetRegistry(NS + '.LabNotebook')
      .then(
      function (BLNRegistry)
      {
        return BLNRegistry.addAll([newBLN]);
      }
    )

      .then(
      function ()
      {
        return getParticipantRegistry(NS + '.researcher');
      }
    )

      .then(
      function (researcherRegistry)
      {
        return researcherRegistry.addAll([researcher1, researcher2])
      }
    )

      .then(
      function ()
      {
        return getParticipantRegistry(NS + '.inspector');
      }
    )

      .then(
      function (inspectorRegistry)
      {
        return inspectorRegistry.addAll([inspector1, inspector2])
      }
    )

      .then(
      function ()
      {
        return getParticipantRegistry(NS + '.officer');
      }
    )

      .then(
      function (officerRegistry)
      {
        return officerRegistry.addAll([officer1, officer2])
      }
    )

      .then(
      function ()
      {
        return getParticipantRegistry(NS + '.head');
      }
    )

      .then(
      function (headRegistry)
      {
        return headRegistry.addAll([head])
      }
    )

      .then(
      function ()
      {
        return getAssetRegistry(NS + '.NotebookPage')
      }
    )

      .then(
      function (PageRegistry)
      {
        return PageRegistry.addAll([newPage]);
      }
    );
}


/*
   Create a new lab notebook (by an officer)
    @param {labnotebook.blockchain.initBLN} initBLN
    @transaction
*/
function initBLN(initBLN)
{
   	 var factory = getFactory();
     var NS = 'labnotebook.blockchain';
  
     var ProjectID = initBLN.ProjectID;
     var whenCreated = initBLN.timestamp;
     whenCreated.setDate(whenCreated.getDate());

     var newBLN = factory.newResource(NS, 'LabNotebook', ProjectID);
     var rArr = initBLN.researchers;
     var iArr = initBLN.inspectors;
     var oArr = initBLN.officers;
     var hArr = initBLN.heads;
  
	 var Researcher = factory.newRelationship(NS, 'researcher', rArr);
  	 var Officer = factory.newRelationship(NS, 'officer', oArr);
  	 var Inspector = factory.newRelationship(NS, 'inspector', iArr);
  	 var Head = factory.newRelationship(NS, 'head', hArr);
  
  	 newBLN.cumulPages = 1;
     newBLN.StartDate = whenCreated;

  	 newBLN.Researcher = [Researcher];
     newBLN.Officer = [Officer];
     newBLN.Inspector = [Inspector];
     newBLN.Head = [Head];
  
     newBLN.oStatus = 'UNDEFINED';
  	 newBLN.iStatus = 'UNDEFINED';
  
  	 // Create an initial NotebookPage
  	 var mother = factory.newRelationship(NS, 'LabNotebook', ProjectID);
  	 var pgID = ProjectID + '_1';
     var newPage = factory.newResource(NS, 'NotebookPage', pgID);
  	 
  	 newPage.PageNum = 1;
     newPage.Status = 'UNDEFINED';
  	 newPage.WroteDate = whenCreated;
     
     var Advisor = factory.newRelationship(NS, 'head', hArr);
     newPage.Advisor = [Advisor];
     newBLN.firstPage = [newPage];
    
     return getAssetRegistry(NS + '.LabNotebook')
        	.then(
       		function (BLNRegistry)
      		{
            	return BLNRegistry.addAll([newBLN]);
       		}
     		)
        	.then(
       		function ()
        	{
            	return getAssetRegistry(NS + '.NotebookPage')
       		}
     		)
        
       		.then(
       		function (PageRegistry)
      		{
            	return PageRegistry.addAll([newPage]);
       		}
     		);
}

/*
   Write a lab notebook (by a researcher)
    @param {labnotebook.blockchain.writePage} w
    @transaction
*/

function writePage(w)
{
	var factory = getFactory();
	var NS = 'labnotebook.blockchain';

    var mother = w.Project;
    var writerID = w.Writer;
    var advisorID = w.Advisor;

  	var pgNO = mother.cumulPages + 1;
    var pgID = mother.ProjectID + '_' + pgNO.toString();
    var wDate = w.timestamp;	
    wDate.setDate(wDate.getDate());

    var writerRel = factory.newRelationship(NS, 'researcher', writerID);
    var advisorRel = factory.newRelationship(NS, 'head', advisorID);
    var newPage = factory.newResource(NS, 'NotebookPage', pgID);
    newPage.PageID = pgID.toString();
    newPage.PageNum = pgNO;   
    newPage.WroteDate = wDate;
    newPage.Status = 'UNDEFINED';
    newPage.Writer = [writerRel];
    newPage.Advisor = [advisorRel];
    newPage.Contents = [w.contents];

    return getAssetRegistry(NS + '.NotebookPage')
          .then(
          function (PageRegistry)
          {
            return PageRegistry.addAll([newPage]);
          }
          )
  		
      	  .then(
      	  function ()
      	  {
            return getAssetRegistry(NS + '.LabNotebook');
          }
      	  )
          
          .then(
          function (cumulPageUpdate)
          {
            mother.cumulPages += 1;
            return cumulPageUpdate.update(mother);
          }
          );                  
}


/*
	Modify a lab notebook (by a researcher)
    @param {labnotebook.blockchain.researcher_modifyBLN} m
    @transaction
*/

function modifyPage(m)
{
	 var factory = getFactory();
     var NS = 'labnotebook.blockchain';
  	 
	 var mother = m.Project;
     var pageID = m.PageToModify;
     var writerID = m.Writer;
     
     var mDate = m.timestamp;	
     mDate.setDate(mDate.getDate());

     var writerRel = factory.newRelationship(NS, 'researcher', writerID);
     var newPage = factory.newRelationship(NS, 'NotebookPage', pageID);
  	   
  
     return getAssetRegistry(NS + '.NotebookPage')
          .then(
          function (ContentsUpdate)
          {
            pageID.Contents = m.modiContents;
            pageID.ModifiedDate = mDate;
            return ContentsUpdate.update(pageID);
          }
          );                  
}

/*
	Request acceptance of a specific notebook page to a professor(by a researcher)
    @param {labnotebook.blockchain.researcher_requestAcceptance} r
    @transaction
*/

function requestAcceptance(r)
{
	 var factory = getFactory();
     var NS = 'labnotebook.blockchain';
	 
  	 var pageID = r.PageToBeRequest;
  	 var researcherID = r.Reseaercher;
  	 var headID = r.requestToWhom;
  	
  	 var page = factory.newRelationship(NS, 'NotebookPage', pageID);
  	 var requester = factory.newRelationship(NS, 'researcher', researcherID);
  	 var officer = factory.newRelationship(NS, 'officer', headID);
  	 var reqDate = r.timestamp;
  	 reqDate.setDate(reqDate.getDate());
  
  	return getAssetRegistry(NS + '.NotebookPage')
  	.then(
    function (requestPage)
    {
      	pageID.Status = 'REQUESTED';
		pageID.RequestedDate = reqDate;
      	return requestPage.update(pageID);
    }
    );
}

/*
	Verify a written notebook page (by a verifier)
    @param {labnotebook.blockchain.verifier_verifyBLN} v
    @transaction
*/
function verifyPage(v)
{
  	var factory = getFactory();
    var NS = 'labnotebook.blockchain';
  	
  	var verifierID = v.verifier;
  	var pageID = v.pageToBeVerified;
  
  	var veriPage = factory.newRelationship(NS, 'NotebookPage', pageID);
  	var verifier = factory.newRelationship(NS, 'head', verifierID);
  	
  	var veriDate = v.timestamp;
  	veriDate.setDate(veriDate.getDate());
  	
  	var veriResult = v.verificationResult;
 
  	return getAssetRegistry(NS + '.NotebookPage')
  			.then(
       		function(verifyRegistry)
       		{
              	if (veriResult == true)
                {
                  	pageID.Status = 'ACCEPTED';
                  	pageID.CheckedDate = veriDate;
					return verifyRegistry.update(pageID);
                }
              	else
                {
                  	pageID.Status = 'REJECTED';
                  	pageID.CheckedDate = veriDate;
					return verifyRegistry.update(pageID);
                }
            }
       		);
}

/*
	Process a completed lab notebook (by an officer)
    @param {labnotebook.blockchain.officer_processBLN} p
    @transaction
*/
function processLN(p)
{
  	var factory = getFactory();
    var NS = 'labnotebook.blockchain';
  
  	var officerID = p.Officer;
    var LNID = p.LNToBeProcessed;
  
  	var officers = factory.newRelationship(NS, 'officer', officerID);
    var pageToBeChecked = factory.newRelationship(NS, 'LabNotebook', LNID);
  	var procStatus = p.Status;
  	var procDate = p.timestamp;
  	procDate.setDate(procDate.getDate());
  
    return getAssetRegistry(NS + '.LabNotebook')
  			.then(
       		function(processRegistry)
       		{
              	if (procStatus == 'ADMIT')
                {
                  	LNID.oStatus = 'ADMITTED';
                  	LNID.ProcessedDate = procDate;
					return processRegistry.update(LNID);
                }
              	else if (procStatus == 'REJECT')
                {
	 				LNID.oStatus = 'REJECTED';
                  	LNID.ProcessedDate = procDate;
					return processRegistry.update(LNID);
                }
              	else if (procStatus == 'TRNASFER')
                {
                  	LNID.oStatus = 'TRANSFERRED';
                  	LNID.ProcessedDate = procDate;
					return processRegistry.update(LNID);
                }
            }
       		);
}

/*
	Inspet the whole lab notebook (by an inspector)
    @param {labnotebook.blockchain.inspector_checkBLN} i
    @transaction
*/
function inspectLN(i)
{
  	var factory = getFactory();
    var NS = 'labnotebook.blockchain';
  	
  	var inspectorID = i.Inspector;
    var LNID = i.LNname;
  
  	var inspectors = factory.newRelationship(NS, 'inspector', inspectorID);
  	var LNToBeChecked = factory.newRelationship(NS, 'LabNotebook', LNID);
    
  	var inspDate = i.timestamp;
    inspDate.setDate(inspDate.getDate());
  	var inspResult = i.inspectionResult;
  	
  	return getAssetRegistry(NS + '.LabNotebook')
  			.then(
       		function(inspectionRegistry)
       		{
              	if (inspResult == true)
                {
                  	LNID.iStatus = 'PASSED';
                  	LNID.InspectedDate = inspDate;
					return inspectionRegistry.update(LNID);
                }
              	else 
                {
	 				LNID.iStatus = 'VIOLATED';
                  	LNID.InspectedDate = inspDate;
					return inspectionRegistry.update(LNID);
                }
            }
       		);
}

/*
	Close the completed lab notebook
    @param {labnotebook.blockchain.closeBLN} close
    @transaction
*/
function closeLN(close)
{
  	var factory = getFactory();
    var NS = 'labnotebook.blockchain';
  
  	var endDate = close.timestamp;
  	endDate.setDate(endDate.getDate());
  	
  	var note = close.LabNotebook;
  
  	return getAssetRegistry(NS + '.LabNotebook')
  	.then(
    function (LNRegistry)
    {
		note.EndDate = endDate;
      	return LNRegistry.update(note);
    }
    );
}

/*
    Create a new researcher
    @param {labnotebook.blockchain.newResearcher} newR
    @transaction
*/
function newResearcher(newR)
{
    var factory = getFactory();
    var NS = 'labnotebook.blockchain';
    
    // Create new researchers
    var ID = newR.ResearcherID;
    var researcher = factory.newResource(NS, 'researcher', ID);
    var name = factory.newConcept(NS, 'Name');
    name.firstName = newR.name.firstName;
    name.lastName = newR.name.lastName;
    researcher.name = name;
    researcher.Organization = newR.Organization;
    researcher.Position = newR.Position;
	
  	return getParticipantRegistry(NS + '.researcher')
      .then(
      function (researcherRegistry)
      {
        return researcherRegistry.add(researcher);
      }
    )
}


/*
    Create a new officer
    @param {labnotebook.blockchain.newOfficer} newO
    @transaction
*/
function newOfficer(newO)
{
    var factory = getFactory();
    var NS = 'labnotebook.blockchain';
    
    // Create new researchers
    var ID = newO.OfficerID;
    var officer = factory.newResource(NS, 'officer', ID);
    var name = factory.newConcept(NS, 'Name');
    name.firstName = newR.name.firstName;
    name.lastName = newR.name.lastName;
    officer.name = name;
    officer.Organization = newR.Organization;
    officer.Position = newR.Position;
	
  	return getParticipantRegistry(NS + '.officer')
      .then(
      function (officerRegistry)
      {
        return officerRegistry.add(officer);
      }
    )
}

/*
    Create a new officer
    @param {labnotebook.blockchain.newInspector} newI
    @transaction
*/
function newInspector(newI)
{
    var factory = getFactory();
    var NS = 'labnotebook.blockchain';
    
    // Create new researchers
    var ID = newI.InspectorID;
    var inspector = factory.newResource(NS, 'inspector', ID);
    var name = factory.newConcept(NS, 'Name');
    name.firstName = newI.name.firstName;
    name.lastName = newI.name.lastName;
    inspector.name = name;
    inspector.Organization = newI.Organization;
    inspector.Position = newI.Position;
	
  	return getParticipantRegistry(NS + '.inspector')
      .then(
      function (inspectorRegistry)
      {
        return inspectorRegistry.add(inspector);
      }
    )
}

/*
    Create a new head
    @param {labnotebook.blockchain.newHead} newH
    @transaction
*/
function newHead(newH)
{
    var factory = getFactory();
    var NS = 'labnotebook.blockchain';
    
    // Create new researchers
    var ID = newH.InspectorID;
    var head = factory.newResource(NS, 'haed', ID);
    var name = factory.newConcept(NS, 'Name');
    name.firstName = newH.name.firstName;
    name.lastName = newH.name.lastName;
    head.name = name;
    head.Organization = newH.Organization;
    head.Position = newH.Position;
	
  	return getParticipantRegistry(NS + '.head')
      .then(
      function (headRegistry)
      {
        return headRegistry.add(head);
      }
    )
}
