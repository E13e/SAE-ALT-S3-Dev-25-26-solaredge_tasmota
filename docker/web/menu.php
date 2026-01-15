        <!-- Menu vertical sur la gauche -->
        <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div class="position-sticky">
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php"> Accueil </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="consultDate.php"> Consulter les médias par date </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="consultType.php"> Consulter les médias par type</a>
                    </li> 
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="AjoutType.php"> Ajouter un Type de Médias </a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="Deconnexion.php"> Déconnexion </a>
                    </li>  
                    <li class="nav-item">
                        <a class="nav-link" href="RunSqlScript.php"> Réinitialiser la BD </a>
                    </li>  
                    <?php
                        if (isset($_COOKIE['clarroutisGuillaume'])){
                            echo "<li class=\"nav-item\">
                                    <a class=\"nav-link\" href=\"DetruireCookie.php\"> Détruire cookie </a>
                                </li>";
                        }              
                        ?>
                </ul>
            </div>
        </nav>
		
<!-- Script JavaScript pour ajouter la classe 'active' -->
<script>
  // Récupère l'URL actuelle de la page
  const currentPage = window.location.pathname;

  // Sélectionne tous les liens du menu
  const navLinks = document.querySelectorAll('.nav-link');

  // Parcourt les liens et compare leur attribut 'href' avec l'URL actuelle
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage.split("/").pop()) {
      link.classList.add('active');
    }
  });
</script>