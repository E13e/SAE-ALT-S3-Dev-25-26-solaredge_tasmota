<html>
<head>
    <title>Dashboard SAE</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>cc</h1>

    <?php 
        $fichier = "/var/www/json/test.json";
        
        if (file_exists($fichier)) {
            $handler = fopen($fichier,"r");
            $donnees = fread($handler, filesize($fichier));

            fclose($handler);
            
            $donneesJson= json_decode($donnees, true);
        } else {
            echo "Fichier non trouvé.";
        }
    ?>

    <table>
        <thead>
            <?php if (!empty($donneesJson)): ?>
                <?php foreach ($donneesJson as $key => $value): ?>
                    <th><?php echo htmlspecialchars($key); ?></th>
                <?php endforeach; ?>
            <?php endif; ?>
        </thead>
        <tbody>
            <?php if (!empty($donneesJson)): ?>
                <tr>
                    <?php foreach ($donneesJson as $key => $value): ?>
                        <td>
                            <?php 
                            if (is_array($value)) {
                                foreach ($value as $subKey => $subValue) {
                                    echo $subKey . ": " . $subValue . "<br>";
                                }
                            } else {
                                echo htmlspecialchars($value);
                            }
                            ?>
                        </td>
                    <?php endforeach; ?>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

</body>
</html>
