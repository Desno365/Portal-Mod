cd /Users/Desno365/Documents/Projects/MinecraftMods/Portal-Mod/Portal-Mod/modpkg
find . -name '*.DS_Store' -type f -delete
rm build/Portal_2_Mod_r000_Desno365.modpkg
zip -rq build/Portal_2_Mod_r000_Desno365.modpkg images
zip -rq build/Portal_2_Mod_r000_Desno365.modpkg script
zip -rq build/Portal_2_Mod_r000_Desno365.modpkg portal-mod-sounds