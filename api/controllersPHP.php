<?php

  // Configuration base de donné
  $mysqli = new mysqli('localhost','root','','beautemiaouf');
  $mysqli->set_charset("utf8");

  // Test la connection a la BD
    if (mysqli_connect_errno($mysqli))
    {
      die("Connection Échoué:" . mysqli_connect_error());
    }

    

if(isset($_GET['Action'])){
  switch ($_GET['Action']) {
    case 'PostClient':
       PostClient($mysqli);
      break;
    case 'GetAnimaux':
      GetAnimaux($mysqli);
      break;
     case 'GetFicheAnimal':
      GetFicheAnimal($mysqli);
      break;
    case 'GetAnimauxClient':
      GetAnimauxClient($mysqli);
      break;
    case 'GetAnniversaireAnimaux':
      GetAnniversaireAnimaux($mysqli);
      break;     
    case 'PostAnimaux':
       PostAnimaux($mysqli);
      break;
    case 'PutAnimal':
       PutAnimal($mysqli);
      break;
    case 'DelAnimal':
       DelAnimal($mysqli);
      break;
    case 'GetClients':
      GetClients($mysqli);
      break;
    case 'GetFicheClient':
      GetFicheClient($mysqli);
      break;
    case 'PostRDV':
       PostRDV($mysqli);
      break;
    case 'PutRDV':
       PutRDV($mysqli);
      break;
    case 'GetListeRDV':
       GetListeRDV($mysqli);
      break;
    case 'GetRdvAnimaux':
       GetRdvAnimaux($mysqli);
      break;
   case 'GetRDV':
       GetRDV($mysqli);
      break;
    case 'GetDayRDV':
       GetDayRDV($mysqli);
      break;
    case 'DelRDV':
       DelRDV($mysqli);
      break;
    case 'PutFicheClient':
       PutFicheClient($mysqli);
      break;
    case 'PutFicheClientAttente':
       PutFicheClientAttente($mysqli);
      break;
    case 'GetDetail':
       GetDetail($mysqli);
      break;
    case 'PostDetail':
       PostDetail($mysqli);
      break;
    case 'PutDetail':
       PutDetail($mysqli);
      break;
    case 'GetTotalDetail':
       GetTotalDetail($mysqli);
      break;
    case 'GetService':
       GetService($mysqli);
      break;
    case 'GetServiceRDV':
       GetServiceRDV($mysqli);
      break;
    case 'Login':
       Login($mysqli);
      break;
    case 'PostSave':
       PostSave($mysqli);
      break;
    case 'SendEmail':
       SendEmail($mysqli);
      break;
    case 'GetSetting':
       GetSetting($mysqli);
      break;
    case 'PutSetting':
       PutSetting($mysqli);
      break;
    default:
      break;
  }
}

//---------------------------------------
//Vérifit le login
//---------------------------------------
function Login($mysqli) {
   $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $User = addslashes($request->User);
    $Pass = addslashes($request->Pass);

$query = "SELECT Nom_Utilisateur, Mot_De_Passe from entreprise";
   $result = $mysqli->query($query);
  while($row = $result->fetch_assoc()){
    $Table_User = $row['Nom_Utilisateur'];
    $Table_Pass = $row['Mot_De_Passe'];
  }

  if($Table_User == $User && $Table_Pass== $Pass){
    $reponse = True;
  }
  else{
    $reponse = False;
  }

  $json = json_encode($reponse);
  echo $json;
  exit;
  
}

//---------------------------------------
//post save
//---------------------------------------
function PostSave($mysqli){
      
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

        $host = 'localhost';
        $db = 'beautemiaouf';
        $user = 'root';
        $port="80";
        $pass = "";
        $file = '\beauteMiaOuf_backup_'.@date("Y-m-d-H").'.sql';
        
        $command = "C:\wamp64\bin\mysql\mysql5.7.19\bin\mysqldump.exe --opt -h".$host." -u".$user." ".$db." > C:\BackupBeauteMiaouf".$file;
        exec($command);
        exit;
}


//---------------------------------------
//Get des services
//---------------------------------------
function GetService($mysqli) {
  
  $cpt = 0;

  $query = "SELECT * FROM service";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $Service[$cpt]['No_Service'] =  $row['No_Service'];
     $Service[$cpt]['Nom_Service'] =  $row['Nom_Service'];
     $Service[$cpt]['Description'] =  $row['Description'];
     $cpt++;
  }

$json = json_encode($Service);
echo $json;
exit;

}



//---------------------------------------
//Get des services pour un RDV
//---------------------------------------
function GetServiceRDV($mysqli) {
  
  $No_Rdv = $_GET['No_Rdv'];
  $cpt = 0;

  $query = "SELECT * FROM service INNER JOIN traitement on traitement.No_Service = service.No_Service left join detail on detail.No_Detail = traitement.No_Detail where traitement.No_Rdv = $No_Rdv";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $Service[$cpt]['No_Service'] =  $row['No_Service'];
     $Service[$cpt]['Nom_Service'] =  $row['Nom_Service'];
     $Service[$cpt]['Description'] =  $row['Description'];
     $Service[$cpt]['No_Rdv'] =  $row['No_Rdv'];
     $Service[$cpt]['No_Detail'] =  $row['No_Detail'];
     $Service[$cpt]['Date_Detail'] =  $row['Date_Detail'];
     $cpt++;
  }

$json = json_encode($Service);
echo $json;
exit;

}

//---------------------------------------
//Get des détails
//---------------------------------------
function GetDetail($mysqli) {
  
  $No_Detail = $_GET['NoDetail'];

  $query = "SELECT * FROM detail WHERE No_Detail = $No_Detail ORDER By Date_Detail Desc LIMIT 1";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $Detail['No_Detail'] =  $row['No_Detail'];
     $Detail['No_Animal'] = $row['No_Animal'];
     $Detail['Date_Detail'] = $row['Date_Detail'];
     $Detail['Un'] = $row['Un'];
     $Detail['Deux'] = $row['Deux'];
     $Detail['Trois'] = $row['Trois'];
     $Detail['Quatre'] = $row['Quatre'];
     $Detail['Cinq'] = $row['Cinq'];
     $Detail['Six'] = $row['Six'];
     $Detail['Sept'] = $row['Sept'];
     $Detail['Huit'] = $row['Huit'];
     $Detail['Neuf'] = $row['Neuf'];
     $Detail['Dix'] = $row['Dix'];
  }

$json = json_encode($Detail);
echo $json;
exit;

}


//---------------------------------------
//Get de tout les details
//---------------------------------------
function GetTotalDetail($mysqli) {
  $cpt=0;
  $Detail = array();
  $No_Animal = $_GET['NoAnimal'];

  $query = "SELECT * FROM detail WHERE No_Animal = $No_Animal ORDER By Date_Detail Desc, No_Detail Desc";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $Detail[$cpt]['No_Detail'] =  $row['No_Detail'];
     $Detail[$cpt]['No_Animal'] = $row['No_Animal'];
     $Detail[$cpt]['Date_Detail'] = $row['Date_Detail'];
     $Detail[$cpt]['Un'] = $row['Un'];
     $Detail[$cpt]['Deux'] = $row['Deux'];
     $Detail[$cpt]['Trois'] = $row['Trois'];
     $Detail[$cpt]['Quatre'] = $row['Quatre'];
     $Detail[$cpt]['Cinq'] = $row['Cinq'];
     $Detail[$cpt]['Six'] = $row['Six'];
     $Detail[$cpt]['Sept'] = $row['Sept'];
     $Detail[$cpt]['Huit'] = $row['Huit'];
     $Detail[$cpt]['Neuf'] = $row['Neuf'];
     $Detail[$cpt]['Dix'] = $row['Dix'];
     $cpt++;
  }

$json = json_encode($Detail);
echo $json;
exit;

}


//---------------------------------------
//Post data des détails
//---------------------------------------
function PostDetail($mysqli) {
 $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Detail = 0;
    $No_Animal = $request->Detail->No_Animal;
    $Date_Detail = $request->Detail->Date_Detail;
    $Un = addslashes($request->Detail->Un);
    $Deux = addslashes($request->Detail->Deux);
    $Trois = addslashes($request->Detail->Trois);
    $Quatre = addslashes($request->Detail->Quatre);
    $Cinq = addslashes($request->Detail->Cinq);
    $Six = addslashes($request->Detail->Six);
    $Sept = addslashes($request->Detail->Sept);
    $Huit = addslashes($request->Detail->Huit);
    $Neuf = addslashes($request->Detail->Neuf);
    $Dix = addslashes($request->Detail->Dix);

$savequery = "INSERT INTO detail VALUES (0, $No_Animal,'$Date_Detail','$Un','$Deux','$Trois','$Quatre','$Cinq','$Six','$Sept','$Huit','$Neuf','$Dix')";

  $mysqli->query($savequery);


$query = "SELECT No_Detail FROM detail ORDER BY No_Detail DESC LIMIT 1";
$result = $mysqli->query($query);


while($row = $result->fetch_assoc()){
    $Detail['No_Detail'] = $row['No_Detail'];
}

$json = json_encode($Detail['No_Detail']);
echo $json;
exit;

} 



//---------------------------------------
//Put data des détails
//---------------------------------------
function PutDetail($mysqli) {
 $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Detail = $request->Detail->No_Detail;
    $Un = addslashes($request->Detail->Un);
    $Deux = addslashes($request->Detail->Deux);
    $Trois = addslashes($request->Detail->Trois);
    $Quatre = addslashes($request->Detail->Quatre);
    $Cinq = addslashes($request->Detail->Cinq);
    $Six = addslashes($request->Detail->Six);
    $Sept = addslashes($request->Detail->Sept);
    $Huit = addslashes($request->Detail->Huit);
    $Neuf = addslashes($request->Detail->Neuf);
    $Dix = addslashes($request->Detail->Dix);

$savequery = "UPDATE detail SET Un ='$Un',Deux='$Deux',Trois='$Trois',Quatre='$Quatre',Cinq='$Cinq',Six='$Six',Sept='$Sept',Huit='$Huit',Neuf='$Neuf',Dix='$Dix' WHERE No_Detail = $No_Detail";

  $mysqli->query($savequery);

} 


//---------------------------------------
//Get data des Clients
//---------------------------------------
function GetClients($mysqli) {
  $listeClient = array();
  $cpt = 0;
  $query = "SELECT clients.No_Client,clients.Nom, clients.Prenom,clients.Telephone_Principal, clients.Telephone_Secondaire,clients.Email,clients.Actif, clients.Adresse, clients.Code_Postal, clients.Ville, clients.Date_Creation, clients.Referer_Par, clients.Note, clients.En_Attente , clients.Attente_Depuis, clients.Note_Attente, clients.Num_Acomba, MIN(CASE WHEN rdv.Date_Rdv >= CURRENT_DATE THEN rdv.Date_Rdv END) as 'Date_Rdv', rdv.No_Rdv FROM clients LEFT JOIN animal ON clients.No_Client = animal.No_Client LEFT JOIN rdv_animaux ON animal.No_Animal = rdv_animaux.No_Animal LEFT JOIN rdv ON rdv.No_Rdv = rdv_animaux.No_Rdv group by clients.No_Client ORDER By clients.No_Client";
  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $listeClient[$cpt]['No_Client'] =  $row['No_Client'];
     $listeClient[$cpt]['Nom'] = $row['Nom'];
     $listeClient[$cpt]['Prenom'] = $row['Prenom'];
     $listeClient[$cpt]['Telephone_Principal'] = $row['Telephone_Principal'];
     $listeClient[$cpt]['Telephone_Secondaire'] = $row['Telephone_Secondaire'];
     $listeClient[$cpt]['Email'] = $row['Email'];
     $listeClient[$cpt]['Actif'] = $row['Actif'];
     $listeClient[$cpt]['Adresse'] = $row['Adresse'];
     $listeClient[$cpt]['Code_Postal'] = $row['Code_Postal'];
     $listeClient[$cpt]['Ville'] = $row['Ville'];
     $listeClient[$cpt]['Date_Creation'] = $row['Date_Creation'];
     $listeClient[$cpt]['Referer_Par'] = $row['Referer_Par'];
     $listeClient[$cpt]['Note'] = $row['Note'];
     $listeClient[$cpt]['En_Attente'] = $row['En_Attente'];
     $listeClient[$cpt]['Attente_Depuis'] = $row['Attente_Depuis'];
     $listeClient[$cpt]['Note_Attente'] = $row['Note_Attente'];
     $listeClient[$cpt]['Num_Acomba'] = $row['Num_Acomba'];
     $listeClient[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $cpt++;
  }

$json = json_encode($listeClient);
echo $json;
exit;
}




//---------------------------------------
//Post data des Clients
//---------------------------------------
function PostClient($mysqli) {
 $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No = addslashes($request->newClient->No_Client);
    $Nom = addslashes($request->newClient->Nom);
    $Prenom = addslashes($request->newClient->Prenom);
    $Telephone_Principal = $request->newClient->Telephone_Principal;
    $Telephone_Secondaire = $request->newClient->Telephone_Secondaire;
    $Email = addslashes($request->newClient->Email);
    $Actif = $request->newClient->Actif;
    $Adresse = addslashes($request->newClient->Adresse);
    $Code_Postal = $request->newClient->Code_Postal;
    $Ville = addslashes($request->newClient->Ville);
    $Date_Creation = $request->newClient->Date_Creation;
    $Referer_Par = addslashes($request->newClient->Referer_Par);
    $Note = addslashes($request->newClient->Note);
    $En_Attente = $request->newClient->En_Attente;
    $Note_Attente = addslashes($request->newClient->Note_Attente);
    $Num_Acomba = addslashes($request->newClient->Num_Acomba);

$savequery = "INSERT INTO clients VALUES (0,'$Nom','$Prenom','$Telephone_Principal','$Telephone_Secondaire','$Email', $Actif,'$Adresse','$Code_Postal','$Ville','$Date_Creation','$Referer_Par','$Note', $En_Attente, null,'$Note_Attente','$Num_Acomba')";

  $mysqli->query($savequery);


$query = "SELECT No_Client FROM clients ORDER BY No_Client DESC LIMIT 1";
$result = $mysqli->query($query);


while($row = $result->fetch_assoc()){
    $Client['No_Client'] = $row['No_Client'];
}

$json = json_encode($Client);
echo $json;
exit;


} 


//---------------------------------------
//Put pour les modification d'un client
//---------------------------------------
function PutFicheClient($mysqli){
  $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Client = $request->Client->No_Client;
    $Nom = $request->Client->Nom;
    $Prenom = $request->Client->Prenom;
    $Telephone_Principal = $request->Client->Telephone_Principal;
    $Telephone_Secondaire = $request->Client->Telephone_Secondaire;
    $Email = addslashes($request->Client->Email);
    $Actif = $request->Client->Actif;
    $Adresse = addslashes($request->Client->Adresse);
    $Code_Postal = $request->Client->Code_Postal;
    $Ville = addslashes($request->Client->Ville);
    $Referer_Par = addslashes($request->Client->Referer_Par);
    $Note = addslashes($request->Client->Note);
    $Num_Acomba = addslashes($request->Client->Num_Acomba);
    $En_Attente = $request->Client->En_Attente;
    $Note_Attente = addslashes($request->Client->Note_Attente);

$savequery = "UPDATE clients SET Nom = '$Nom', Prenom = '$Prenom', Telephone_Principal='$Telephone_Principal', Telephone_Secondaire='$Telephone_Secondaire', Email='$Email',Actif=$Actif,Adresse='$Adresse', Code_Postal= '$Code_Postal', Ville='$Ville',Referer_Par='$Referer_Par',Note='$Note', Num_Acomba='$Num_Acomba',En_Attente = '$En_Attente', Note_Attente = '$Note_Attente' WHERE No_Client=$No_Client";

   $mysqli->query($savequery);

}



//---------------------------------------
//Put pour les modification d'un client
//---------------------------------------
function PutFicheClientAttente($mysqli){
  $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Client = $request->Client->No_Client;
    $En_Attente = $request->Client->En_Attente;
    $Note_Attente = addslashes($request->Client->Note_Attente);
    $boolAttente = $request->Client->boolAttente;
    $Attente_Depuis = $request->Client->Attente_Depuis;

    if($boolAttente == true){
  $savequery = "UPDATE clients SET En_Attente = $En_Attente, Note_Attente = '$Note_Attente', Attente_Depuis = null WHERE No_Client=$No_Client";
}else{
  $savequery = "UPDATE clients SET En_Attente = $En_Attente, Note_Attente = '$Note_Attente', Attente_Depuis = '$Attente_Depuis' WHERE No_Client=$No_Client";
}

   $mysqli->query($savequery);
}


//---------------------------------------
//Get data des Animaux
//---------------------------------------
function GetAnimaux($mysqli) {
  $listeAnimaux = array();
  $cpt = 0;
  $query = "SELECT animal.No_Animal, clients.No_Client, clients.Nom, clients.Prenom, clients.Adresse, clients.Telephone_Principal, animal.Type, animal.Nom_Animal, animal.Race, animal.Date_Naissance, animal.Sexe,  animal.Comportement, MIN(CASE WHEN rdv.Date_Rdv >= CURRENT_DATE THEN rdv.Date_Rdv END) as 'Date_Rdv', YEAR(CURRENT_TIMESTAMP) - YEAR(animal.Date_Naissance) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(animal.Date_Naissance, 5)) as Age   FROM animal INNER JOIN clients ON clients.No_Client = animal.No_Client LEFT join rdv_animaux on rdv_animaux.No_Animal = animal.No_Animal left JOIN rdv on rdv.No_Rdv = rdv_animaux.No_Rdv WHERE animal.Actif = 1 GROUP by animal.No_Animal";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $listeAnimaux[$cpt]['No_Animal'] = $row['No_Animal'];
     $listeAnimaux[$cpt]['No_Client'] = $row['No_Client'];
     $listeAnimaux[$cpt]['Nom'] = $row['Nom'];
     $listeAnimaux[$cpt]['Prenom'] = $row['Prenom'];
     $listeAnimaux[$cpt]['Adresse'] = $row['Adresse']; 
     $listeAnimaux[$cpt]['Telephone_Principal'] = $row['Telephone_Principal']; 
     $listeAnimaux[$cpt]['Type'] = $row['Type'];
     $listeAnimaux[$cpt]['Nom_Animal'] = $row['Nom_Animal'];
     $listeAnimaux[$cpt]['Race'] = $row['Race'];
     $listeAnimaux[$cpt]['Date_Naissance'] = $row['Date_Naissance'];
     $listeAnimaux[$cpt]['Sexe'] = $row['Sexe'];
     $listeAnimaux[$cpt]['Comportement'] = $row['Comportement'];
     $listeAnimaux[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $listeAnimaux[$cpt]['Age'] = $row['Age'];
     $cpt++;
  }
$json = json_encode($listeAnimaux);
echo $json;
exit;
}



//---------------------------------------
//Get data des anniversaire des Animaux
//---------------------------------------
function GetAnniversaireAnimaux($mysqli) {

  $Frequence = $_GET['Frequence'];
  $listeAnimaux = array();
  $cpt = 0;


    $query = "SELECT animal.No_Animal , DATE_FORMAT(animal.Date_Naissance, '%m-%d') AS Bday, MAX(rdv.Date_Rdv) as Date_Rdv, YEAR(CURRENT_TIMESTAMP) - YEAR(animal.Date_Naissance) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(animal.Date_Naissance, 5)) as Age, animal.No_Client, clients.Nom, clients.Prenom, clients.Adresse, clients.Telephone_Principal, animal.Type, animal.Nom_Animal, animal.Race, animal.Date_Naissance, animal.Sexe, animal.Comportement, animal.Date_Ouverture  FROM animal INNER JOIN clients ON clients.No_Client = animal.No_Client LEFT join rdv_animaux on rdv_animaux.No_Animal = animal.No_Animal left JOIN rdv on rdv.No_Rdv = rdv_animaux.No_Rdv WHERE animal.Actif = 1 and DATE_FORMAT(animal.Date_Naissance, '%m-%d') BETWEEN DATE_FORMAT( curdate(), '%m-%d') AND DATE_FORMAT( curdate() + INTERVAL $Frequence DAY, '%m-%d') GROUP by animal.No_Animal ORDER BY `Bday` ASC";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $listeAnimaux[$cpt]['No_Animal'] = $row['No_Animal'];
     $listeAnimaux[$cpt]['Age'] = $row['Age'];
     $listeAnimaux[$cpt]['No_Client'] = $row['No_Client'];
     $listeAnimaux[$cpt]['Nom'] = $row['Nom'];
     $listeAnimaux[$cpt]['Prenom'] = $row['Prenom'];
     $listeAnimaux[$cpt]['Adresse'] = $row['Adresse']; 
     $listeAnimaux[$cpt]['Telephone_Principal'] = $row['Telephone_Principal']; 
     $listeAnimaux[$cpt]['Type'] = $row['Type'];
     $listeAnimaux[$cpt]['Nom_Animal'] = $row['Nom_Animal'];
     $listeAnimaux[$cpt]['Race'] = $row['Race'];
     $listeAnimaux[$cpt]['Date_Naissance'] = $row['Date_Naissance'];
     $listeAnimaux[$cpt]['Sexe'] = $row['Sexe'];
     $listeAnimaux[$cpt]['Comportement'] = $row['Comportement'];
     $listeAnimaux[$cpt]['Date_Ouverture'] = $row['Date_Ouverture'];
     $listeAnimaux[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $cpt++;
  }
$json = json_encode($listeAnimaux);
echo $json;
exit;
}


//---------------------------------------
//Get fiche d'un animal
//---------------------------------------
function GetFicheAnimal($mysqli) {

  $No_Animal = $_GET['NoAnimal'];

  $query = "SELECT * FROM animal WHERE No_Animal = $No_Animal";
  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $ficheAnimal['No_Animal'] = $row['No_Animal'];
     $ficheAnimal['No_Client'] = $row['No_Client'];
     $ficheAnimal['Type'] = $row['Type'];
     $ficheAnimal['Nom_Animal'] = $row['Nom_Animal'];
     $ficheAnimal['Race'] = $row['Race'];
     $ficheAnimal['Vacciner'] = $row['Vacciner'];
     $ficheAnimal['Operer'] = $row['Operer'];
     $ficheAnimal['Date_Naissance'] = $row['Date_Naissance'];
     $ficheAnimal['Sexe'] = $row['Sexe'];
     $ficheAnimal['Diplome'] = $row['Diplome'];
     $ficheAnimal['Comportement'] = $row['Comportement'];
     $ficheAnimal['Maladie_Autres'] = $row['Maladie_Autres'];
     $ficheAnimal['Specifications'] = $row['Specifications'];
     $ficheAnimal['Date_Ouverture'] = $row['Date_Ouverture'];
     $ficheAnimal['Actif'] = $row['Actif'];
  }

$json = json_encode($ficheAnimal);
echo $json;
exit;


}



//---------------------------------------
//Get des tout les animaux d'un client
//---------------------------------------
function GetAnimauxClient($mysqli) {
  $cpt = 0;
  $ficheAnimal = array();
  $No_Client = $_GET['No_Client'];

$query = "SELECT * From animal where No_Client =$No_Client AND Actif = 1";

  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $ficheAnimal[$cpt]['No_Animal'] = $row['No_Animal'];
     $ficheAnimal[$cpt]['No_Client'] = $row['No_Client'];
     $ficheAnimal[$cpt]['Type'] = $row['Type'];
     $ficheAnimal[$cpt]['Race'] = $row['Race'];
     $ficheAnimal[$cpt]['Date_Naissance'] = $row['Date_Naissance'];
     $ficheAnimal[$cpt]['Nom_Animal'] = $row['Nom_Animal'];
     $ficheAnimal[$cpt]['Comportement'] = $row['Comportement'];
     $cpt++;
  }

$json = json_encode($ficheAnimal);
echo $json;
exit;
}

//---------------------------------------
//Put data d'un animal
//---------------------------------------
function PutAnimal($mysqli) {
 $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Animal = $request->Animal->No_Animal;
    $No_Client = $request->Animal->No_Client;
    $Type = $request->Animal->Type;
    $Nom_Animal = addslashes($request->Animal->Nom_Animal);
    $Race = addslashes($request->Animal->Race);
    $Vacciner = $request->Animal->Vacciner;
    $Operer = $request->Animal->Operer;
    $Date_Naissance = $request->Animal->Date_Naissance;
    $Sexe = $request->Animal->Sexe;
    $Diplome = $request->Animal->Diplome;
    $Comportement = $request->Animal->Comportement;
    $Maladie_Autres = addslashes($request->Animal->Maladie_Autres);
    $Specifications = addslashes($request->Animal->Specifications);
    $Date_Ouverture = $request->Animal->Date_Ouverture;

$savequery = "UPDATE animal SET Type='$Type', Nom_Animal='$Nom_Animal', Race='$Race',Vacciner=$Vacciner,Operer=$Operer, Date_Naissance= '$Date_Naissance', Sexe='$Sexe',Diplome=$Diplome,Comportement='$Comportement', Maladie_Autres='$Maladie_Autres',Specifications = '$Specifications' WHERE No_Animal=$No_Animal";
   $mysqli->query($savequery);

} 


//---------------------------------------
//Post data des Animaux
//---------------------------------------
function PostAnimaux($mysqli) {
 $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Animal = $request->newAnimal->No_Animal;
    $No_Client = $request->newAnimal->No_Client;
    $Type = $request->newAnimal->Type;
    $Nom_Animal = addslashes($request->newAnimal->Nom_Animal);
    $Race = addslashes($request->newAnimal->Race);
    $Vacciner = $request->newAnimal->Vacciner;
    $Operer = $request->newAnimal->Operer;
    $Date_Naissance = $request->newAnimal->Date_Naissance;
    $Sexe = $request->newAnimal->Sexe;
    $Diplome = $request->newAnimal->Diplome;
    $Comportement = $request->newAnimal->Comportement;
    $Maladie_Autres = addslashes($request->newAnimal->Maladie_Autres);
    $Specifications = addslashes($request->newAnimal->Specifications);
    $Date_Ouverture = $request->newAnimal->Date_Ouverture;
    $Actif = 1;

$savequery = "INSERT INTO animal VALUES (0,$No_Client, '$Type','$Nom_Animal','$Race',$Vacciner, $Operer,'$Date_Naissance','$Sexe',$Diplome,'$Comportement','$Maladie_Autres','$Specifications', '$Date_Ouverture',$Actif) ";
   $mysqli->query($savequery);


$query = "SELECT No_Animal FROM animal ORDER BY No_Animal DESC LIMIT 1";
$result = $mysqli->query($query);


while($row = $result->fetch_assoc()){
    $Animal['No_Animal'] = $row['No_Animal'];
}

$json = json_encode($Animal);
echo $json;
exit;

} 


//---------------------------------------
//Delete un Animal
//---------------------------------------
function DelAnimal($mysqli) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Animal = $request->NoAnimal;

$savequery = "UPDATE animal SET animal.Actif=0 WHERE No_Animal=$No_Animal";
$mysqli->multi_query($savequery);


} 



//---------------------------------------
//Get des tout les informations du clients sélectionné
//---------------------------------------
function GetFicheClient($mysqli) {
  $No_Client = $_GET['No_Client'];

 $query = "SELECT * From clients WHERE No_Client= $No_Client";


  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
      $ficheClient['No_Client'] = $row['No_Client'];
      $ficheClient['Nom'] = $row['Nom'];
      $ficheClient['Prenom'] = $row['Prenom'];
      $ficheClient['Telephone_Principal'] = $row['Telephone_Principal'];
      $ficheClient['Telephone_Secondaire'] = $row['Telephone_Secondaire'];
      $ficheClient['Email'] = $row['Email'];
      $ficheClient['Actif'] = $row['Actif'];
      $ficheClient['Adresse'] = $row['Adresse'];
      $ficheClient['Code_Postal'] = $row['Code_Postal'];
      $ficheClient['Ville'] = $row['Ville'];
      $ficheClient['Date_Creation'] = $row['Date_Creation'];
      $ficheClient['Referer_Par'] = $row['Referer_Par'];
      $ficheClient['Note'] = $row['Note'];
      $ficheClient['En_Attente'] = $row['En_Attente'];
      $ficheClient['Attente_Depuis'] = $row['Attente_Depuis'];
      $ficheClient['Note_Attente'] = $row['Note_Attente'];
      $ficheClient['Num_Acomba'] = $row['Num_Acomba'];
  }

$json = json_encode($ficheClient);
echo $json;
exit;

}


//---------------------------------------
//Post data des RDV
//---------------------------------------
function PostRDV($mysqli) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Animal = $request->Animal->No_Animal;
    $Date_Rdv = $request->newRDV->Date_Rdv;
    $Heure_Debut = $request->newRDV->Heure_Debut;
    $Heure_Fin = $request->newRDV->Heure_Fin;
    $Details = addslashes($request->newRDV->Details);
    $Service = array();
    $Service = $request->newRDV->Service;

try{
     
  $mysqli->multi_query("INSERT INTO rdv VALUES (0, '$Date_Rdv','$Heure_Debut','$Heure_Fin','$Details'); INSERT INTO rdv_animaux VALUES ($No_Animal, LAST_INSERT_ID());SELECT No_Rdv From rdv ORDER By No_Rdv desc LIMIT 1");

  do {
     if ($result = $mysqli->store_result()) {
        while ($row = $result->fetch_row()) {
            $No_Rdv = $row[0];
        }
     }
     if(!$mysqli->more_results()){
      break;
     }
  } while ($mysqli->next_result());


      for ($i=0; $i < count($Service) ; $i++) { 
           $No_Service = $Service[$i]->No_Service;
           $No_Detail = $Service[$i]->No_Detail;

        if($No_Detail!=null){
            $query = "INSERT into traitement (No_Rdv, No_Service, No_Detail) VALUES ($No_Rdv,$No_Service, $No_Detail)";
          }else{
            $query = "INSERT into traitement (No_Rdv, No_Service, No_Detail) VALUES ($No_Rdv,$No_Service, null)";
          }
        $mysqli->multi_query($query);
      }

   

  }catch(Exception $e){
     echo $e;
   }  
  
} 


//---------------------------------------
//Delete un RDV
//---------------------------------------
function DelRDV($mysqli) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Rdv = $request->RDV->No_Rdv;
    $No_Animal = $request->RDV->No_Animal;


$savequery = "DELETE FROM rdv WHERE No_Rdv = $No_Rdv";
$mysqli->multi_query($savequery);

$savequery = "DELETE FROM rdv_animaux WHERE No_Rdv = $No_Rdv and No_Animal = $No_Animal";
$mysqli->multi_query($savequery);

$savequery = "DELETE FROM traitement WHERE No_Rdv = $No_Rdv";
$mysqli->multi_query($savequery);

} 


//---------------------------------------
//Modifit un RDV
//---------------------------------------
function PutRDV($mysqli) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Rdv = $request->RDV->No_Rdv;
    $Date_Rdv = $request->RDV->Date_Rdv;
    $Details = addslashes($request->RDV->Details);
    $Heure_Debut = $request->RDV->Heure_Debut;
    $Heure_Fin = $request->RDV->Heure_Fin;
    $Service = array();
    $Service = $request->RDV->Service;


$savequery = "UPDATE rdv SET Heure_Debut='$Heure_Debut', Heure_Fin='$Heure_Fin', Details='$Details', Date_Rdv = '$Date_Rdv' WHERE No_Rdv =$No_Rdv";
$mysqli->multi_query($savequery);

$delquery = "DELETE FROM traitement WHERE No_Rdv = $No_Rdv";
$mysqli->multi_query($delquery);

  for ($i=0; $i < count($Service) ; $i++) { 
     $No_Service = $Service[$i]->No_Service;
     $No_Detail = $Service[$i]->No_Detail;

if($No_Detail!=null){
    $savequery = "INSERT into traitement (No_Rdv, No_Service, No_Detail) VALUES ($No_Rdv,$No_Service, $No_Detail)";
  }else{
    $savequery = "INSERT into traitement (No_Rdv, No_Service, No_Detail) VALUES ($No_Rdv,$No_Service, null)";
  }
    $mysqli->multi_query($savequery);
  }
} 


//---------------------------------------
//Get data des RDV
//---------------------------------------
function GetListeRDV($mysqli) {
  
  $listeRDV = array();
  $cpt = 0;
  $query = "SELECT clients.No_Client,clients.Nom, clients.Prenom, clients.Telephone_Principal, rdv.No_Rdv, rdv.Date_Rdv, rdv.Heure_Debut, rdv.Heure_Fin, rdv.Details,animal.No_Animal, animal.Type, animal.Nom_Animal , animal.Date_Naissance, animal.Comportement FROM rdv INNER JOIN rdv_animaux on rdv.No_Rdv=rdv_animaux.No_Rdv Inner join animal on animal.No_Animal = rdv_animaux.No_Animal inner join clients on clients.No_Client = animal.No_Client where rdv.Date_Rdv >= DATE_ADD(CURRENT_DATE, INTERVAL -2 MONTH)";
  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc()){
     $listeRDV[$cpt]['No_Rdv'] = $row['No_Rdv'];
     $listeRDV[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $listeRDV[$cpt]['Heure_Debut'] = $row['Heure_Debut'];
     $listeRDV[$cpt]['Heure_Fin'] = $row['Heure_Fin'];
     $listeRDV[$cpt]['Details'] = $row['Details'];
     $listeRDV[$cpt]['No_Animal'] = $row['No_Animal'];
     $listeRDV[$cpt]['Nom_Animal'] = $row['Nom_Animal'];
     $listeRDV[$cpt]['Date_Naissance'] = $row['Date_Naissance'];
     $listeRDV[$cpt]['Comportement'] = $row['Comportement'];
     $listeRDV[$cpt]['Type'] = $row['Type'];
     $listeRDV[$cpt]['No_Client'] =  $row['No_Client'];
     $listeRDV[$cpt]['Nom'] = $row['Nom'];
     $listeRDV[$cpt]['Prenom'] = $row['Prenom'];
     $listeRDV[$cpt]['Telephone_Principal'] = $row['Telephone_Principal'];
     $cpt++;
  }

$json = json_encode($listeRDV);
echo $json;
exit;
}

//---------------------------------------
//Get data des RDV par naimaux
//---------------------------------------
function GetRdvAnimaux($mysqli) {

  $No_Animal = $_GET['No_Animal'];
  $listeRDV = array();
  $cpt = 0;
  $query = "SELECT * FROM rdv INNER JOIN rdv_animaux on rdv.No_Rdv=rdv_animaux.No_Rdv where rdv_animaux.No_Animal = $No_Animal and rdv.Date_Rdv >= CURRENT_DATE";
  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $listeRDV[$cpt]['No_Rdv'] = $row['No_Rdv'];
     $listeRDV[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $listeRDV[$cpt]['Heure_Debut'] = $row['Heure_Debut'];
     $listeRDV[$cpt]['Heure_Fin'] = $row['Heure_Fin'];
     $listeRDV[$cpt]['Details'] = $row['Details'];
     $listeRDV[$cpt]['No_Animal'] = $row['No_Animal'];
     $cpt++;
  }

$json = json_encode($listeRDV);
echo $json;
exit;
}


//---------------------------------------
//Get data des RDV pour la recherche
//---------------------------------------
function GetRDV($mysqli) {

  $Frequence = $_GET['Frequence'];
  $listeRDV = array();
  $cpt = 0;

if($Frequence == "Futur"){
  $query = "SELECT rdv.No_Rdv, rdv.Date_Rdv, rdv.Heure_Debut, rdv.Heure_Fin, rdv.Details, animal.No_Animal, animal.Nom_Animal, animal.Type,clients.No_Client, clients.Nom, clients.Prenom, clients.Adresse, clients.Telephone_Principal FROM rdv inner join rdv_animaux on rdv_animaux.No_Rdv = rdv.No_Rdv inner join animal on animal.No_Animal = rdv_animaux.No_Animal inner join clients on clients.No_Client = animal.No_Client where rdv.Date_Rdv >= CURRENT_DATE";
}else{
  $query = "SELECT rdv.No_Rdv, rdv.Date_Rdv, rdv.Heure_Debut, rdv.Heure_Fin, rdv.Details, animal.No_Animal, animal.Nom_Animal, animal.Type, clients.No_Client, clients.Nom, clients.Prenom, clients.Adresse, clients.Telephone_Principal FROM rdv inner join rdv_animaux on rdv_animaux.No_Rdv = rdv.No_Rdv inner join animal on animal.No_Animal = rdv_animaux.No_Animal inner join clients on clients.No_Client = animal.No_Client where rdv.Date_Rdv < CURRENT_DATE";
}

  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $listeRDV[$cpt]['No_Rdv'] = $row['No_Rdv'];
     $listeRDV[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $listeRDV[$cpt]['Heure_Debut'] = $row['Heure_Debut'];
     $listeRDV[$cpt]['Heure_Fin'] = $row['Heure_Fin'];
     $listeRDV[$cpt]['Details'] = $row['Details'];
     $listeRDV[$cpt]['No_Animal'] = $row['No_Animal'];
     $listeRDV[$cpt]['Nom_Animal'] = $row['Nom_Animal'];
     $listeRDV[$cpt]['Type'] = $row['Type'];
     $listeRDV[$cpt]['No_Client'] = $row['No_Client'];
     $listeRDV[$cpt]['Nom'] = $row['Nom'];
     $listeRDV[$cpt]['Prenom'] = $row['Prenom'];
     $listeRDV[$cpt]['Adresse'] = $row['Adresse'];
     $listeRDV[$cpt]['Telephone_Principal'] = $row['Telephone_Principal'];
     $cpt++;
  }


$json = json_encode($listeRDV);
echo $json;
exit;

}


//---------------------------------------
//Get data des RDV par journée
//---------------------------------------
function GetDayRDV($mysqli) {

  $Date = $_GET['Date'];
  $listeRDV = array();
  $cpt = 0;
  $query = "SELECT * FROM rdv INNER JOIN rdv_animaux on rdv.No_Rdv=rdv_animaux.No_Rdv INNER join animal on animal.No_Animal=rdv_animaux.No_Animal WHERE rdv.Date_Rdv = '$Date'";
  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $listeRDV[$cpt]['No_Rdv'] = $row['No_Rdv'];
     $listeRDV[$cpt]['Date_Rdv'] = $row['Date_Rdv'];
     $listeRDV[$cpt]['Heure_Debut'] = $row['Heure_Debut'];
     $listeRDV[$cpt]['Heure_Fin'] = $row['Heure_Fin'];
     $listeRDV[$cpt]['Nom_Animal'] = $row['Nom_Animal'];
     $listeRDV[$cpt]['Comportement'] = $row['Comportement'];
     $listeRDV[$cpt]['No_Animal'] = $row['No_Animal'];
     $listeRDV[$cpt]['Type'] = $row['Type'];
     $cpt++;
  }

$json = json_encode($listeRDV);
echo $json;
exit;

}



//---------------------------------------
//Get data des paramêtre dénéraux
//---------------------------------------
function getSetting($mysqli) {
  $setting = array();
  $query = "SELECT * FROM entreprise";
  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $setting['No_Entreprise'] =  $row['No_Entreprise'];
     $setting['Nom_Salon'] = $row['Nom_Salon'];
     $setting['Adresse_Salon'] = $row['Adresse_Salon'];
     $setting['Ville_Salon'] = $row['Ville_Salon'];
     $setting['Code_Postal_Salon'] = $row['Code_Postal_Salon'];
     $setting['Telephone_Salon'] = $row['Telephone_Salon'];
     $setting['Email_Salon'] = $row['Email_Salon'];
     $setting['Nom_Utilisateur'] = $row['Nom_Utilisateur'];
     $setting['Mot_De_Passe'] = $row['Mot_De_Passe'];
     $setting['Dimanche'] = $row['Dimanche'];
     $setting['Lundi'] = $row['Lundi'];
     $setting['Mardi'] = $row['Mardi'];
     $setting['Mercredi'] = $row['Mercredi'];
     $setting['Jeudi'] = $row['Jeudi'];
     $setting['Vendredi'] = $row['Vendredi'];
     $setting['Samedi'] = $row['Samedi'];
     $setting['Heure_Debut'] = $row['Heure_Debut'];
     $setting['Heure_Fin'] = $row['Heure_Fin'];
     $setting['Frequence'] = $row['Frequence'];
     $setting['DateSauvegarde'] = $row['DateSauvegarde'];
  }

$json = json_encode($setting);
echo $json;
exit;
}



//---------------------------------------
//Modifit un entreprise
//---------------------------------------
function PutSetting($mysqli) {
    
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $No_Entreprise = $request->sauvegarde->No_Entreprise;
    $Nom_Salon = addslashes($request->sauvegarde->Nom_Salon);
    $Adresse_Salon = addslashes($request->sauvegarde->Adresse_Salon);
    $Ville_Salon = addslashes($request->sauvegarde->Ville_Salon);
    $Code_Postal_Salon = $request->sauvegarde->Code_Postal_Salon;
    $Telephone_Salon = $request->sauvegarde->Telephone_Salon;
    $Email_Salon = addslashes($request->sauvegarde->Email_Salon);
    $Nom_Utilisateur = $request->sauvegarde->Nom_Utilisateur;
    $Mot_De_Passe = $request->sauvegarde->Mot_De_Passe;
    $Dimanche = $request->sauvegarde->Dimanche;
    $Lundi = $request->sauvegarde->Lundi;
    $Mardi = $request->sauvegarde->Mardi;
    $Mercredi = $request->sauvegarde->Mercredi;
    $Jeudi = $request->sauvegarde->Jeudi;
    $Vendredi = $request->sauvegarde->Vendredi;
    $Samedi = $request->sauvegarde->Samedi;
    $Heure_Debut = $request->sauvegarde->Heure_Debut;
    $Heure_Fin = $request->sauvegarde->Heure_Fin;
    $Frequence = $request->sauvegarde->Frequence;
    $DateSauvegarde = $request->sauvegarde->DateSauvegarde;


$savequery = "UPDATE entreprise SET No_Entreprise='$No_Entreprise', Nom_Salon='$Nom_Salon', Adresse_Salon='$Adresse_Salon', Ville_Salon = '$Ville_Salon',Code_Postal_Salon='$Code_Postal_Salon', Telephone_Salon='$Telephone_Salon', Email_Salon='$Email_Salon', Nom_Utilisateur = '$Nom_Utilisateur',Mot_De_Passe='$Mot_De_Passe', Dimanche='$Dimanche', Lundi='$Lundi', Mardi = '$Mardi', Mercredi = '$Mercredi',Jeudi='$Jeudi', Vendredi='$Vendredi',Samedi='$Samedi', Heure_Debut='$Heure_Debut', Heure_Fin = '$Heure_Fin', Frequence = $Frequence,DateSauvegarde='$DateSauvegarde'";


$mysqli->multi_query($savequery);

} 


//---------------------------------------
//Envoit d'un email
//---------------------------------------
function SendEmail($mysqli){
  $setting = array();
  $query = "SELECT * FROM entreprise";
  $result = $mysqli->query($query);


  while($row = $result->fetch_assoc()){
     $setting['No_Entreprise'] =  $row['No_Entreprise'];
     $setting['Nom_Salon'] = $row['Nom_Salon'];
     $setting['Adresse_Salon'] = $row['Adresse_Salon'];
     $setting['Ville_Salon'] = $row['Ville_Salon'];
     $setting['Code_Postal_Salon'] = $row['Code_Postal_Salon'];
     $setting['Telephone_Salon'] = $row['Telephone_Salon'];
     $setting['Email_Salon'] = $row['Email_Salon'];
     $setting['Nom_Utilisateur'] = $row['Nom_Utilisateur'];
     $setting['Mot_De_Passe'] = $row['Mot_De_Passe'];
     $setting['Dimanche'] = $row['Dimanche'];
     $setting['Lundi'] = $row['Lundi'];
     $setting['Mardi'] = $row['Mardi'];
     $setting['Mercredi'] = $row['Mercredi'];
     $setting['Jeudi'] = $row['Jeudi'];
     $setting['Vendredi'] = $row['Vendredi'];
     $setting['Samedi'] = $row['Samedi'];
     $setting['Heure_Debut'] = $row['Heure_Debut'];
     $setting['Heure_Fin'] = $row['Heure_Fin'];
     $setting['Frequence'] = $row['Frequence'];
     $setting['DateSauvegarde'] = $row['DateSauvegarde'];
  }

require_once 'PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;


$mail->isSMTP();                            // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';             // Specify main and backup SMTP servers   
$mail->Username = 'sonemailICI@gmail.com';          // SMTP username
$mail->Password = ''; // SMTP password
$mail->SMTPSecure = 'tls';                  // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                          // TCP port to connect to
$mail->addAddress('mxmx800@gmail.com');   // Add a recipient


$mail->isHTML(true);  // Set email format to HTML

$bodyContent = "<html>
      <head>
          <title>Contact</title>
          <style>
              body
              {
                background-color:#bbb0fff;
              }
              p
              {
                font-family:arial,sans-serif;
              }
              a
              {
                color:#000;
                text-decoration:none;
                font-weight:bold;
              }
          </style>
      </head>
      <body>
          <h2>Bonjours</h2>
          <p>Nous vous envoyons ce mail pour vous remettre votre mot de passe.</p>
          <hr>
          <p><b>Utilisateur: </b> " . $setting['Nom_Utilisateur']  ."</p>
          <p><b>Mot de passe est: </b> " . $setting['Mot_De_Passe']  ."</p>
          <a href='http://localhost/BeauteMiaouf/Login'>Cliquez ici BeauteMiaouf</a>
      </body>
    </html>";

$mail->Subject = 'Systeme BeauteMiaouf Information';
$mail->Body    = $bodyContent;

$mail->smtpConnect(
    array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false,
            "allow_self_signed" => true
        )
    )
);

if(!$mail->send()) 
{
    echo "Mailer Error: " . $mail->ErrorInfo;
} 
else 
{
    echo "Message has been sent successfully";
}

exit;
}

?>

