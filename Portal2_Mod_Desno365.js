/*
This work is licensed under the Creative Commons Attribution- NonCommercial 4.0 International License. To view a copy
of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, 444 Castro
Street, Suite 900, Mountain View, California, 94041, USA.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* ******* Portal 2 Mod by Desno365 ******* */

const DEBUG = false;

// updates variables
const CURRENT_VERSION = "r010";
var latestVersion;

// minecraft variables
const GameMode = {
	SURVIVAL: 0,
	CREATIVE: 1
};
const ITEM_CATEGORY_TOOL = 3; // 3 seems to be the category of the tools
const ITEM_CATEGORY_MATERIAL = 1;
const VEL_Y_OFFSET = -0.07840000092983246;
var isInGame = false;

// textures variables
var textureUiShowed = false;

// activity and other Android variables
var currentActivity = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var sdcard = android.os.Environment.getExternalStorageDirectory();

// display size and density variables
var metrics = new android.util.DisplayMetrics();
currentActivity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
var displayHeight = metrics.heightPixels;
var displayWidth = metrics.widthPixels;
var deviceDensity = metrics.density;
metrics = null;

// sounds variables
var radioPlayer = new android.media.MediaPlayer();
const MAX_LOGARITHMIC_VOLUME = 20;

// settings for audio
var generalVolume = 1;

// change carried item variables
var previousCarriedItem = 0;
var previousSlotId = 0;

// buttons UI settings variables
const BUTTONS_SIZE_DEFAULT = 24;
var buttonsSize = BUTTONS_SIZE_DEFAULT;
var pixelsOffsetButtons = 0;
var minecraftStyleForButtons = false;

// player interactions variables
var velBeforeX = 0, velBeforeY = 0, velBeforeZ = 0;
var blockUnderPlayerBefore = 0;

// images in base64
var bluePortalImage = "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";
var orangePortalImage = "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";
var overlayFull = "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";
var overlayBlue = "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";
var overlayOrange = "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";
var overlayBlank = "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";
var divider = "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";

// decoded images variables
var bluePortalScaled;
var orangePortalScaled;
var overlayFullScaled;
var overlayBlueScaled;
var overlayOrangeScaled;
var overlayBlankScaled;
var dividerScaled;

// item functions needed on load
Item.setVerticalRender = function(id)
{
	try {
		Item.setHandEquipped(id, true);
	} catch(e) { /* old version of BlockLauncher */ }
}
Item.defineItem = function(id, textureName, textureNumber, name, stackLimit)
{
	try
	{
		ModPE.setItem(id, textureName, textureNumber, name, stackLimit);
	}catch(e)
	{
		// user hasn't installed the texture pack
		if(!textureUiShowed)
			pleaseInstallTextureUI();

		ModPE.setItem(id, "skull_zombie", 0, name, stackLimit);
	}
}
Item.newArmor = function(id, iconName, iconIndex, name, texture, damageReduceAmount, maxDamage, armorType)
{
	try
	{
		//Item.defineArmor(int id, String iconName, int iconIndex, String name, String texture, int damageReduceAmount, int maxDamage, int armorType)
		Item.defineArmor(id, iconName, iconIndex, name, texture, damageReduceAmount, maxDamage, armorType);
	}catch(e)
	{
		// user hasn't installed the texture pack
		if(!textureUiShowed)
			pleaseInstallTextureUI();

		Item.defineArmor(id, "skull_zombie", 0, name, "armor/chain_2.png", damageReduceAmount, maxDamage, armorType);
	}
}

// TODO update constant variables names
// portal guns variables
var blueBullet;
var blueBulletLaunched = false;
var orangeBullet;
var orangeBulletLaunched = false;
var portalWithUseItem = false;
var bluePortal = null;
var bluePortalCreated = false;
var orangePortal = null;
var orangePortalCreated = false;

var overlayImageView;
var showingOverlayID = 0;
const OVERLAY_FULL = 1;
const OVERLAY_BLUE = 2;
const OVERLAY_ORANGE = 3;
const OVERLAY_BLANK = 4;

// portal guns picking variables
var pgIsPickingEnabled = false;
var isPortalGunPicking = false;
var pgPickButtonFalse;
var pgPickButtonTrue;
var pgDropButtonFalse;
var pgDropButtonTrue;
var pgEntity = null;
var pgIsBlock = false;
var pgBlockId;
var pgBlockData;

const PORTAL_GUN_BLUE_ID = 3651;
const PORTAL_GUN_DAMAGE = 1000;
Item.defineItem(PORTAL_GUN_BLUE_ID, "portalgunblue", 0, "PortalGun");
Item.setMaxDamage(PORTAL_GUN_BLUE_ID, PORTAL_GUN_DAMAGE);
Item.addShapedRecipe(PORTAL_GUN_BLUE_ID, 1, 0, [
	"f f",
	" d ",
	"f f"], ["f", 265, 0, "d", 264, 0]);
Item.setCategory(PORTAL_GUN_BLUE_ID, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(PORTAL_GUN_BLUE_ID);

const PORTAL_GUN_GOLD_ID = 3652;
const PORTAL_GUN_GOLD_DAMAGE = 500;
Item.defineItem(PORTAL_GUN_GOLD_ID, "portalgungold", 0, "PortalGun Gold");
Item.setMaxDamage(PORTAL_GUN_GOLD_ID, PORTAL_GUN_GOLD_DAMAGE);
Item.addShapedRecipe(PORTAL_GUN_GOLD_ID, 1, 0, [
	"f f",
	" g ",
	"f f"], ["f", 265, 0, "g", 266, 0]);
Item.setCategory(PORTAL_GUN_GOLD_ID, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(PORTAL_GUN_GOLD_ID);

const PORTAL_GUN_IRON_ID = 3653;
const PORTAL_GUN_IRON_DAMAGE = 250;
Item.defineItem(PORTAL_GUN_IRON_ID, "portalguniron", 0, "PortalGun Iron");
Item.setMaxDamage(PORTAL_GUN_IRON_ID, PORTAL_GUN_IRON_DAMAGE);
Item.addShapedRecipe(PORTAL_GUN_IRON_ID, 1, 0, [
	"fff",
	"f f",
	"fff"], ["f", 265, 0]);
Item.setCategory(PORTAL_GUN_IRON_ID, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(PORTAL_GUN_IRON_ID);

const PORTAL_GUN_LAVA_ID = 3654;
const PORTAL_GUN_LAVA_DAMAGE = 200;
Item.defineItem(PORTAL_GUN_LAVA_ID, "portalgunlava", 0, "PortalGun Lava");
Item.setMaxDamage(PORTAL_GUN_LAVA_ID, PORTAL_GUN_LAVA_DAMAGE);
Item.addShapedRecipe(PORTAL_GUN_LAVA_ID, 1, 0, [
	"f f",
	" a ",
	"f f"], ["f", 265, 0, "a", 259, 0]);
Item.setCategory(PORTAL_GUN_LAVA_ID, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(PORTAL_GUN_LAVA_ID);

const PORTAL_GUN_WOOD_AND_STONE_ID = 3655;
const PORTAL_GUN_WOOD_AND_STONE_DAMAGE = 100;
Item.defineItem(PORTAL_GUN_WOOD_AND_STONE_ID, "portalgunwoodandstone", 0, "PortalGun Wood & Stone");
Item.setMaxDamage(PORTAL_GUN_WOOD_AND_STONE_ID, PORTAL_GUN_WOOD_AND_STONE_DAMAGE);
Item.addShapedRecipe(PORTAL_GUN_WOOD_AND_STONE_ID, 1, 0, [
	"sws",
	"s s",
	"sws"], ["s", 98, 0, "w", 17, 0]);
Item.setCategory(PORTAL_GUN_WOOD_AND_STONE_ID, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(PORTAL_GUN_WOOD_AND_STONE_ID);

const PORTAL_GUN_ORANGE_ID = 3649;
Item.defineItem(PORTAL_GUN_ORANGE_ID, "portalgunorange", 0, "PortalGun");
Item.setMaxDamage(PORTAL_GUN_ORANGE_ID, PORTAL_GUN_DAMAGE);
Item.setVerticalRender(PORTAL_GUN_ORANGE_ID);

var isGravityGunPicking = false;
var ggShootButtonFalse;
var ggShootButtonTrue;
var ggDropButtonFalse;
var ggDropButtonTrue;
var ggEntity = null;
var ggIsBlock = false;
var ggBlockId;
var ggBlockData;
var ggShotBlocksToBePlaced = [];
const GRAVITY_GUN_ID = 3656;
const GRAVITY_GUN_MAX_DAMAGE = 400;
Item.defineItem(GRAVITY_GUN_ID, "gravitygun", 0, "GravityGun");
Item.setMaxDamage(GRAVITY_GUN_ID, GRAVITY_GUN_MAX_DAMAGE);
Item.addShapedRecipe(GRAVITY_GUN_ID, 1, 0, [
	"frf",
	"r r",
	"frf"], ["f", 265, 0, "r", 331, 0]);
Item.setCategory(GRAVITY_GUN_ID, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(GRAVITY_GUN_ID);

const LONG_FALL_BOOT_ID = 3659;
Item.defineItem(LONG_FALL_BOOT_ID, "longfallboot", 0, "Long Fall Boot");
Item.addShapedRecipe(LONG_FALL_BOOT_ID, 1, 0, [
	"   ",
	"f f",
	"r r"], ["f", 265, 0, "r", 331, 0]);

var isFalling = false;
const LONG_FALL_BOOTS_ID = 3660;
const LONG_FALL_BOOTS_MAX_DAMAGE = 1500;
Item.newArmor(LONG_FALL_BOOTS_ID, "longfallboots", 0, "Long Fall Boots", "armor/longfallboots.png", 1, LONG_FALL_BOOTS_MAX_DAMAGE, ArmorType.boots);
Item.addShapedRecipe(LONG_FALL_BOOTS_ID, 1, 0, [
	"   ",
	"   ",
	"l l"], ["l", LONG_FALL_BOOT_ID, 0,]);

var isRadioPlaying = false;
var radioCountdown = 0;
var radioX;
var radioY;
var radioZ;
const RADIO_ID = 3661;
Item.defineItem(RADIO_ID, "portalradio", 0, "Portal Radio");
Item.addShapedRecipe(RADIO_ID, 1, 0, [
	"   ",
	"iii",
	"iri"], ["i", 265, 0, "r", 331, 0]); // i = iron; r = redstone;
Item.setCategory(RADIO_ID, ITEM_CATEGORY_MATERIAL);

const STILL_ALIVE_DISC_ID = 3662;
Item.defineItem(STILL_ALIVE_DISC_ID, "portalradio", 0, "Still Alive Disc");
Item.setCategory(STILL_ALIVE_DISC_ID, ITEM_CATEGORY_TOOL);

const WANT_YOU_GONE_DISC_ID = 3663;
Item.defineItem(WANT_YOU_GONE_DISC_ID, "portalradio", 0, "Want You Gone Disc");
Item.setCategory(WANT_YOU_GONE_DISC_ID, ITEM_CATEGORY_TOOL);

const CARA_MIA_ADDIO_DISC_ID = 3664;
Item.defineItem(CARA_MIA_ADDIO_DISC_ID, "portalradio", 0, "Cara Mia Addio Disc");
Item.setCategory(CARA_MIA_ADDIO_DISC_ID, ITEM_CATEGORY_TOOL);

//########################################################################################################################################################
// Blocks
//########################################################################################################################################################

// block functions needed on load
Block.newBlock = function(id, name, textureNames, sourceId, opaque, renderType)
{
	try
	{
		Block.defineBlock(id, name, textureNames, sourceId, opaque, renderType);
	} catch(e)
	{
		// user hasn't installed the texture pack
		if(!textureUiShowed)
			pleaseInstallTextureUI();

		Block.defineBlock(id, name, "enchanting_table_top", sourceId, opaque, renderType);
	}
}
Block.newPortal = function(id, name, textureName, xMin, yMin, zMin, xMax, yMax, zMax)
{
	Block.newBlock(id, name, textureName, 0, false);
	Block.setShape(id, xMin, yMin, zMin, xMax, yMax, zMax);
	Block.setDestroyTime(id, 3);
	Block.setRenderLayer(id, 3); // in 0.11 was 5
	Block.setLightLevel(id, 3);
	Block.setLightOpacity(id, 0.01);
}

// Type 1
//orange z min down
const ORANGE_Z_MIN_D = 200;
Block.newPortal(ORANGE_Z_MIN_D, "Orange portal z-min-d", "portalorangedown", 0, 0, 1/16, 1, 1, 1/16);

//orange z min up
const ORANGE_Z_MIN_U = 201;
Block.newPortal(ORANGE_Z_MIN_U, "Orange portal z-min-up", "portalorangeup", 0, 0, 1/16, 1, 1, 1/16)


// Type 2
//orange z max down
const ORANGE_Z_MAX_D = 202;
Block.newPortal(ORANGE_Z_MAX_D, "Orange portal z-max-d", "portalorangedown", 0, 0, 15/16, 1, 1, 15/16);

//orange z max up
const ORANGE_Z_MAX_U = 203;
Block.newPortal(ORANGE_Z_MAX_U, "Orange portal z-max-up", "portalorangeup", 0, 0, 15/16, 1, 1, 15/16);


// Type 3
//orange y min down
const ORANGE_Y_MIN_D = 204;
Block.newPortal(ORANGE_Y_MIN_D, "Orange portal y-min-d", "portalorangedown", 0, 1/16, 0, 1, 1/16, 1);

//orange y min up
const ORANGE_Y_MIN_U = 205;
Block.newPortal(ORANGE_Y_MIN_U, "Orange portal y-min-up", "portalorangeup", 0, 1/16, 0, 1, 1/16, 1);


// Type 4
//orange y max down
const ORANGE_Y_MAX_D = 206;
Block.newPortal(ORANGE_Y_MAX_D, "Orange portal y-max-d", "portalorangedown", 0, 15/16, 0, 1, 15/16, 1);

//orange y max up
const ORANGE_Y_MAX_U = 207;
Block.newPortal(ORANGE_Y_MAX_U, "Orange portal y-max-up", "portalorangeup", 0, 15/16, 0, 1, 15/16, 1);


// Type 5
//orange x min down
const ORANGE_X_MIN_D = 208;
Block.newPortal(ORANGE_X_MIN_D, "Orange portal x-min-d", "portalorangedown", 1/16, 0, 0, 1/16, 1, 1);

//orange x min up
const ORANGE_X_MIN_U = 209;
Block.newPortal(ORANGE_X_MIN_U, "Orange portal x-min-up", "portalorangeup", 1/16, 0, 0, 1/16, 1, 1);


// Type 6
//orange x max down
const ORANGE_X_MAX_D = 210;
Block.newPortal(ORANGE_X_MAX_D, "Orange portal x-max-d", "portalorangedown", 15/16, 0, 0, 15/16, 1, 1);

//orange x max up
const ORANGE_X_MAX_U = 211;
Block.newPortal(ORANGE_X_MAX_U, "Orange portal x-max-up", "portalorangeup", 15/16, 0, 0, 15/16, 1, 1);


// Type 1
//blue z min down
const BLUE_Z_MIN_D = 212;
Block.newPortal(BLUE_Z_MIN_D, "Blue portal z-min-d", "portalbluedown", 0, 0, 1/16, 1, 1, 1/16);

//blue z min up
const BLUE_Z_MIN_U = 213;
Block.newPortal(BLUE_Z_MIN_U, "Blue portal z-min-up", "portalblueup", 0, 0, 1/16, 1, 1, 1/16);


// Type 2
//blue z max down
const BLUE_Z_MAX_D = 214;
Block.newPortal(BLUE_Z_MAX_D, "Blue portal z-max-d", "portalbluedown", 0, 0, 15/16, 1, 1, 15/16);

//blue z max up
const BLUE_Z_MAX_U = 215;
Block.newPortal(BLUE_Z_MAX_U, "Blue portal z-max-up", "portalblueup", 0, 0, 15/16, 1, 1, 15/16);


// Type 3
//blue y min down
const BLUE_Y_MIN_D = 216;
Block.newPortal(BLUE_Y_MIN_D, "Blue portal y-min-d", "portalbluedown", 0, 1/16, 0, 1, 1/16, 1);

//blue y min up
const BLUE_Y_MIN_U = 217;
Block.newPortal(BLUE_Y_MIN_U, "Blue portal y-min-up", "portalblueup", 0, 1/16, 0, 1, 1/16, 1);


// Type 4
//blue y max down
const BLUE_Y_MAX_D = 218;
Block.newPortal(BLUE_Y_MAX_D, "Blue portal y-max-d", "portalbluedown", 0, 15/16, 0, 1, 15/16, 1);

//blue y max up
const BLUE_Y_MAX_U = 219;
Block.newPortal(BLUE_Y_MAX_U, "Blue portal y-max-up", "portalblueup", 0, 15/16, 0, 1, 15/16, 1);


// Type 5
//blue x min down
const BLUE_X_MIN_D = 220;
Block.newPortal(BLUE_X_MIN_D, "Blue portal x-min-d", "portalbluedown", 1/16, 0, 0, 1/16, 1, 1);

//blue x min up
const BLUE_X_MIN_U = 221;
Block.newPortal(BLUE_X_MIN_U, "Blue portal x-min-up", "portalblueup", 1/16, 0, 0, 1/16, 1, 1);


// Type 6
//blue x max down
const BLUE_X_MAX_D = 222;
Block.newPortal(BLUE_X_MAX_D, "Blue portal x-max-d", "portalbluedown", 15/16, 0, 0, 15/16, 1, 1);

//blue x max up
const BLUE_X_MAX_U = 223;
Block.newPortal(BLUE_X_MAX_U, "Blue portal x-max-up", "portalblueup", 15/16, 0, 0, 15/16, 1, 1);



// jukebox
const MAX_LOGARITHMIC_VOLUME_JUKEBOX = 65;
var nowPlayingMessage = "";
var currentColor = 0;
var jukeboxes = [];
const JUKEBOX_ID = 84;
Block.defineBlock(JUKEBOX_ID, "Jukebox", [["jukebox_side", 0], ["jukebox_top", 0], ["jukebox_side", 0], ["jukebox_side", 0], ["jukebox_side", 0], ["jukebox_side", 0]], 17);
Block.setDestroyTime(JUKEBOX_ID, 2);
Block.setExplosionResistance(JUKEBOX_ID, 30);

// jumper
const JUMPER_ID = 225;
Block.newBlock(JUMPER_ID, "Jumper", "jumper");
Block.setDestroyTime(JUMPER_ID, 1);

// radio
const PORTAL_RADIO_A = 226;
Block.newBlock(PORTAL_RADIO_A, "Portal Radio", [["radiotop", 0], ["radiotop", 0], ["radioside", 0], ["radioside", 0], ["radiodisplay", 0], ["radioside", 0]], 0, false, 0);
Block.setDestroyTime(PORTAL_RADIO_A, 1);
Block.setShape(PORTAL_RADIO_A, 5/16, 0, 0, 11/16, 10/16, 1);
Block.setLightOpacity(PORTAL_RADIO_A, 0.01);
const PORTAL_RADIO_B = 227;
Block.newBlock(PORTAL_RADIO_B, "Portal Radio", [["radiotop", 0], ["radiotop", 0], ["radiodisplay", 0], ["radioside", 0], ["radioside", 0], ["radioside", 0]], 0, false, 0);
Block.setDestroyTime(PORTAL_RADIO_B, 1);
Block.setShape(PORTAL_RADIO_B, 0, 0, 5/16, 1, 10/16, 11/16);
Block.setLightOpacity(PORTAL_RADIO_B, 0.01);
const PORTAL_RADIO_C = 228;
Block.newBlock(PORTAL_RADIO_C, "Portal Radio", [["radiotop", 0], ["radiotop", 0], ["radioside", 0], ["radioside", 0], ["radioside", 0], ["radiodisplay", 0]], 0, false, 0);
Block.setDestroyTime(PORTAL_RADIO_C, 1);
Block.setShape(PORTAL_RADIO_C, 5/16, 0, 0, 11/16, 10/16, 1);
Block.setLightOpacity(PORTAL_RADIO_C, 0.01);
const PORTAL_RADIO_D = 229;
Block.newBlock(PORTAL_RADIO_D, "Portal Radio", [["radiotop", 0], ["radiotop", 0], ["radioside", 0], ["radiodisplay", 0], ["radioside", 0], ["radioside", 0]], 0, false, 0);
Block.setDestroyTime(PORTAL_RADIO_D, 1);
Block.setShape(PORTAL_RADIO_D, 0, 0, 5/16, 1, 10/16, 11/16);
Block.setLightOpacity(PORTAL_RADIO_D, 0.01);

// blue gel
const REPULSION_GEL_ID = 230;
Block.newBlock(REPULSION_GEL_ID, "Repulsion Gel Block", [["wool", 3]]);
Block.setDestroyTime(REPULSION_GEL_ID, 5);

// orange gel
const SPEED_MULTIPLIER_MIN = 1.3;
const SPEED_MULTIPLIER_MAX = 1.65;
var speedMultiplier = SPEED_MULTIPLIER_MIN;
const PROPULSION_GEL_ID = 231;
Block.newBlock(PROPULSION_GEL_ID, "Propulsion Gel Block", [["wool", 1]]);
Block.setDestroyTime(PROPULSION_GEL_ID, 5);

// cubes
const CUBE_NORMAL_ID = 232;
Block.newBlock(CUBE_NORMAL_ID, "Cube", "cubenormal");
Block.setDestroyTime(CUBE_NORMAL_ID, 3);

const CUBE_COMPANION_ID = 233;
Block.newBlock(CUBE_COMPANION_ID, "Companion Cube", "cubecompanion");
Block.setDestroyTime(CUBE_COMPANION_ID, 3);


// blacklist variables
var pickBuggedBlocksBlacklist = [7, 26, 52, 54, 59, 61, 62, 63, 64, 68, 71, 83, 90, 96, 104, 105, 106, 111, 115, 141, 142, 207, ORANGE_Z_MIN_D, ORANGE_Z_MIN_U, ORANGE_Z_MAX_D, ORANGE_Z_MAX_U, ORANGE_Y_MIN_D, ORANGE_Y_MIN_U, ORANGE_Y_MAX_D, ORANGE_Y_MAX_U, ORANGE_X_MIN_D, ORANGE_X_MIN_U, ORANGE_X_MAX_D, ORANGE_X_MAX_U, BLUE_Z_MIN_D, BLUE_Z_MIN_U, BLUE_Z_MAX_D, BLUE_Z_MAX_U, BLUE_Y_MIN_D, BLUE_Y_MIN_U, BLUE_Y_MAX_D, BLUE_Y_MAX_U, BLUE_X_MIN_D, BLUE_X_MIN_U, BLUE_X_MAX_D, BLUE_X_MAX_U];
var pickBlocksBlacklist = [REPULSION_GEL_ID, PROPULSION_GEL_ID, JUMPER_ID];


//########################################################################################################################################################
// Hooks
//########################################################################################################################################################

function newLevel()
{
	isInGame = true;

	if(Level.getGameMode() == GameMode.CREATIVE)
	{
		// crashes in survival
		Player.addItemCreativeInv(PORTAL_GUN_BLUE_ID, 1);
		Player.addItemCreativeInv(PORTAL_GUN_GOLD_ID, 1);
		Player.addItemCreativeInv(PORTAL_GUN_IRON_ID, 1);
		Player.addItemCreativeInv(PORTAL_GUN_LAVA_ID, 1);
		Player.addItemCreativeInv(PORTAL_GUN_WOOD_AND_STONE_ID, 1);
		Player.addItemCreativeInv(GRAVITY_GUN_ID, 1);
		Player.addItemCreativeInv(RADIO_ID, 1);
		Player.addItemCreativeInv(STILL_ALIVE_DISC_ID, 1);
		Player.addItemCreativeInv(WANT_YOU_GONE_DISC_ID, 1);
		Player.addItemCreativeInv(CARA_MIA_ADDIO_DISC_ID, 1);

		Player.addItemCreativeInv(JUKEBOX_ID, 1);
		Player.addItemCreativeInv(JUMPER_ID, 1);
		Player.addItemCreativeInv(REPULSION_GEL_ID, 1);
		Player.addItemCreativeInv(PROPULSION_GEL_ID, 1);
		Player.addItemCreativeInv(CUBE_NORMAL_ID, 1);
		Player.addItemCreativeInv(CUBE_COMPANION_ID, 1);
	}

	new java.lang.Thread(new java.lang.Runnable()
	{
		run: function()
		{
			updateLatestVersionMod();
			if(latestVersion != CURRENT_VERSION && latestVersion != undefined)
				updateAvailableUI();
			else
			{
				if(latestVersion != undefined) // if == undefined there was an error
				{
					currentActivity.runOnUiThread(new java.lang.Runnable() {
						run: function() {
							android.widget.Toast.makeText(currentActivity, new android.text.Html.fromHtml("<b>Portal Mod</b>: You have the latest version."), 0).show();
						}
					});
				}
			}
		}
	}).start();
}

function leaveGame()
{
	isInGame = false;

	previousCarriedItem = 0;
	previousSlotId = 0;

	// player interactions
	velBeforeX = 0;
	velBeforeY = 0;
	velBeforeZ = 0;
	blockUnderPlayerBefore = 0;

	// Portal Gun
	removePortalGunUI();
	blueBulletLaunched = false;
	orangeBulletLaunched = false;

	// Gravity Gun
	removeGravityGunUI();
	ggShotBlocksToBePlaced = [];

	// radio
	stopRadioMusic();

	// orange gel
	speedMultiplier = SPEED_MULTIPLIER_MIN;

	// jukebox
	for(var i in jukeboxes)
		jukeboxes[i].player.reset();

	jukeboxes = [];

	nowPlayingMessage = "";
	currentColor = 0;
}

function useItem(x, y, z, itemId, blockId, side, itemDamage)
{
	x = Math.floor(x);
	y = Math.floor(y);
	z = Math.floor(z);
	//clientMessage(Block.getRenderType(blockId)); // TODO fizzler

	//clientMessage("x " + x + " y " + y + " z " + z);

	// PortalGun Wood & Stone
	if(itemId == PORTAL_GUN_WOOD_AND_STONE_ID)
	{
		var random = Math.floor((Math.random() * 3) + 1);
		Sound.playFromFileName("portals/portal_open" + random + ".wav");

		var placeX = x, placeY = y, placeZ = z;
		// get correct block
		switch(side)
		{
			case 0: // down
			{
				placeY--;
				break;
			}
			case 1: // up
			{
				placeY++;
				break;
			}
			case 2:
			{
				placeZ--;
				break;
			}
			case 3:
			{
				placeZ++;
				break;
			}
			case 4:
			{
				placeX--;
				break;
			}
			case 5:
			{
				placeX++;
				break;
			}
		}

		if(portalWithUseItem)
		{
			setPortalOrange(placeX, placeY, placeZ);
			portalWithUseItem = false;
		} else
		{
			setPortalBlue(placeX, placeY, placeZ);
			portalWithUseItem = true;
		}
		if(Level.getGameMode() == GameMode.SURVIVAL)
			Player.damageCarriedItem();
	}

	// PortalGun picking
	if(pgIsPickingEnabled && isItemPortalGun(itemId) && !isPortalGunPicking)
	{
		if(canBlockBePicked(blockId))
		{
			pickBlockPortalGun(blockId, Level.getData(x, y, z));
			Level.setTile(Math.floor(x), Math.floor(y), Math.floor(z), 0);

			// prevent radio bug
			if(blockId == PORTAL_RADIO_A || blockId == PORTAL_RADIO_B || blockId == PORTAL_RADIO_C || blockId == PORTAL_RADIO_D)
				stopRadioMusic();
		} else
		{
			Sound.playFromFileName("gravitygun/fail.ogg");
			ModPE.showTipMessage("This block can't be picked");
		}
		return;
	}

	// GravityGun
	if(itemId == GRAVITY_GUN_ID && !isGravityGunPicking)
	{
		if(canBlockBePicked(blockId))
		{
			pickBlockGravityGun(blockId, Level.getData(x, y, z));
			Level.setTile(Math.floor(x), Math.floor(y), Math.floor(z), 0);

			// prevent radio bug
			if(blockId == PORTAL_RADIO_A || blockId == PORTAL_RADIO_B || blockId == PORTAL_RADIO_C || blockId == PORTAL_RADIO_D)
				stopRadioMusic();
		} else
		{
			Sound.playFromFileName("gravitygun/fail.ogg");
			ModPE.showTipMessage("This block can't be picked");
		}
		return;
	}

	// radio
	if(blockId == PORTAL_RADIO_A || blockId == PORTAL_RADIO_B || blockId == PORTAL_RADIO_C || blockId == PORTAL_RADIO_D)
	{
		preventDefault();
		if(isRadioPlaying && Math.floor(radioX) == Math.floor(x) && Math.floor(radioY) == Math.floor(y) && Math.floor(radioZ) == Math.floor(z))
		{
			stopRadioMusic();
		} else
		{
			isRadioPlaying = true;
			radioX = Math.floor(x) + 0.5;
			radioY = Math.floor(y);
			radioZ = Math.floor(z) + 0.5;

			startRadioMusic();
		}
	} else
	{
		if(itemId == RADIO_ID)
		{
			var angle = normalizeAngle(Entity.getYaw(Player.getEntity()));
			if((angle >= 0 && angle < 45) || (angle >= 315 && angle <= 360))
			{
				Level.placeBlockFromItem(x, y, z, side, 229);
			}
			if(angle >= 45 && angle < 135)
			{
				Level.placeBlockFromItem(x, y, z, side, 226);
			}
			if(angle >= 135 && angle < 225)
			{
				Level.placeBlockFromItem(x, y, z, side, 227);
			}
			if(angle >= 225 && angle < 315)
			{
				Level.placeBlockFromItem(x, y, z, side, 228);
			}
		}
	}

	// jukebox
	if(blockId == JUKEBOX_ID)
	{
		preventDefault();

		// is block a playing jukebox?
		var checkBlockJukebox = getJukeboxObjectFromXYZ(x, y, z);
		if(checkBlockJukebox != -1)
		{
			checkBlockJukebox.stopJukebox();
			return;
		}

		//is the player carrying a disc?
		if(itemId == STILL_ALIVE_DISC_ID || itemId == WANT_YOU_GONE_DISC_ID || itemId == CARA_MIA_ADDIO_DISC_ID)
		{
			//jukebox: start playing
			try
			{
				jukeboxes.push(new JukeboxClass(Math.floor(x) + 0.5, Math.floor(y), Math.floor(z) + 0.5, itemId));
				if(Level.getGameMode() == GameMode.SURVIVAL)
					Player.decreaseByOneCarriedItem();
			}
			catch(err)
			{
				ModPE.showTipMessage("Portal Mod: Sounds not installed!");
				clientMessage(err);
			}
		}
	}
}

function destroyBlock(x, y, z)
{
	x = Math.floor(x);
	y = Math.floor(y);
	z = Math.floor(z);

	// radio
	if(isRadioPlaying)
	{
		if(x == Math.floor(radioX) && y == Math.floor(radioY) && z == Math.floor(radioZ))
		{
			stopRadioMusic();
		}
	}

	// portals
	if(orangePortalCreated)
	{
		if(x == orangePortal.x1 && y == orangePortal.y1 && z == orangePortal.z1)
		{
			orangePortalCreated = false;
			updateOverlay();
			Level.setTile(orangePortal.x2, orangePortal.y2, orangePortal.z2, 0);
			// TODO save portals
		}
		if(x == orangePortal.x2 && y == orangePortal.y2 && z == orangePortal.z2)
		{
			orangePortalCreated = false;
			updateOverlay();
			Level.setTile(orangePortal.x1, orangePortal.y1, orangePortal.z1, 0);
			// TODO save portals
		}
	}
	if(bluePortalCreated)
	{
		if(x == bluePortal.x1 && y == bluePortal.y1 && z == bluePortal.z1)
		{
			bluePortalCreated = false;
			updateOverlay();
			Level.setTile(bluePortal.x2, bluePortal.y2, bluePortal.z2, 0);
			// TODO save portals
		}
		if(x == bluePortal.x2 && y == bluePortal.y2 && z == bluePortal.z2)
		{
			bluePortalCreated = false;
			updateOverlay();
			Level.setTile(bluePortal.x1, bluePortal.y1, bluePortal.z1, 0);
			// TODO save portals
		}
	}

	// jukebox
	var checkBlockJukebox = getJukeboxObjectFromXYZ(x, y, z);
	if(checkBlockJukebox != -1)
		checkBlockJukebox.stopJukebox();
}

function attackHook(attacker, victim)
{
	var itemId = Player.getCarriedItem();

	if(attacker == Player.getEntity())
	{
		// GravityGun
		if(itemId == GRAVITY_GUN_ID && !isGravityGunPicking)
		{
			preventDefault();
			pickEntityGravityGun(victim);

			// for turrets
			/*for(var i = 0; i < spawnedTurretsNumber; i++)
			{
				if(victim == turrets[i].entity)
				{
					var random = Math.floor((Math.random() * 10) + 1);
					Sound.playFromFileName("turrets/turret_pickup_" + random + ".wav");
					if(singing)
					{
						ModPE.stopMusic();
						singing = false;
					}
					return;
				}
			}*/
		}

		// PortalGun
		if(isItemPortalGun(itemId) && !isPortalGunPicking)
		{
			preventDefault();
			pickEntityPortalGun(victim);

			// for turrets
			/*for(var i = 0; i < spawnedTurretsNumber; i++)
			{
				if(victim == turrets[i].entity)
				{
					var random = Math.floor((Math.random() * 10) + 1);
					Sound.playFromFileName("turrets/turret_pickup_" + random + ".wav");
					if(singing)
					{
						ModPE.stopMusic();
						singing = false;
					}
					return;
				}
			}*/
		}
	}
}

function deathHook(murderer, victim)
{
	// GravityGun
	if(victim == ggEntity)
	{
		if(isGravityGunPicking)
		{
			isGravityGunPicking = false;
			ggEntity = null;
			updateEnabledGravityGunButtons();
		}
	}

	// PortalGun
	if(victim == pgEntity)
	{
		if(isPortalGunPicking)
		{
			isPortalGunPicking = false;
			pgEntity = null;
			updateDropButtonPortalGun();
		}
	}
}

function entityRemovedHook(entity)
{
	// GravityGun
	if(entity == ggEntity)
	{
		if(isGravityGunPicking)
		{
			isGravityGunPicking = false;
			ggEntity = null;
			updateEnabledGravityGunButtons();
		}
	}

	// PortalGun
	if(entity == pgEntity)
	{
		if(isPortalGunPicking)
		{
			isPortalGunPicking = false;
			pgEntity = null;
			updateDropButtonPortalGun();
		}
	}
}

function changeCarriedItemHook(currentItem, previousItem) // not really an hook
{
	// remove gravity gun UI
	if(previousItem == GRAVITY_GUN_ID)
	{
		//
		removeGravityGunUI();
	}

	// remove portal gun UI
	if(isItemPortalGun(previousItem) && !isItemPortalGun(currentItem))
	{
		//
		removePortalGunUI();
	}

	switch(currentItem)
	{
		case GRAVITY_GUN_ID:
		{
			initializeAndShowGravityGunUI();
			break;
		}

		case PORTAL_GUN_BLUE_ID:
		case PORTAL_GUN_GOLD_ID:
		case PORTAL_GUN_IRON_ID:
		case PORTAL_GUN_LAVA_ID:
		case PORTAL_GUN_ORANGE_ID:
		{
			if(!isItemPortalGun(previousItem))
				showPortalGunUI();
			if(!((previousItem == PORTAL_GUN_BLUE_ID && currentItem == PORTAL_GUN_ORANGE_ID) || (previousItem == PORTAL_GUN_ORANGE_ID && currentItem == PORTAL_GUN_BLUE_ID)))
				Sound.playFromFileName("portalgun/portalgun_powerup1.wav");
			break;
		}
	}
}

function jumpHook() // not really an hook
{
	if(blockUnderPlayerBefore == REPULSION_GEL_ID)
	{
		makeBounceSound();
	}
}

function modTick()
{
	var blockUnderPlayer = Level.getTile(Math.floor(Player.getX()), Math.floor(Player.getY()) - 2, Math.floor(Player.getZ()))

	ModTickFunctions.checkChangedCarriedItem();

	ModTickFunctions.checkJumpHook();

	ModTickFunctions.portalsPlayer();

	ModTickFunctions.portalGunBullets();

	ModTickFunctions.portalGunPicking(); // portal gun picking entities

	ModTickFunctions.gravityGun(); // gravity gun picking entities

	ModTickFunctions.placeShotBlocks(); // gravity gun picking entities

	ModTickFunctions.gelBlue(blockUnderPlayer);

	ModTickFunctions.gelOrange(blockUnderPlayer);

	ModTickFunctions.jukebox();

	ModTickFunctions.jumper(blockUnderPlayer);

	ModTickFunctions.longFallBoots(blockUnderPlayer);

	ModTickFunctions.radio();

	// player interactions
	velBeforeX = Entity.getVelX(Player.getEntity());
	velBeforeY = Entity.getVelY(Player.getEntity()); // used also for the blue gel
	velBeforeZ = Entity.getVelZ(Player.getEntity());
	blockUnderPlayerBefore = blockUnderPlayer;
}

var ModTickFunctions = {

	checkChangedCarriedItem: function()
	{
		if(Player.getCarriedItem() != previousCarriedItem)
			changeCarriedItemHook(Player.getCarriedItem(), previousCarriedItem);
		else
		{
			// switching between items with same id but different damage for example
			if(Player.getSelectedSlotId() != previousSlotId)
			{
				changeCarriedItemHook(previousCarriedItem, previousCarriedItem);
			}
		}
		previousCarriedItem = Player.getCarriedItem();
		previousSlotId = Player.getSelectedSlotId();
	},

	checkJumpHook: function()
	{
		if(Entity.getVelY(Player.getEntity()) > VEL_Y_OFFSET && velBeforeY == VEL_Y_OFFSET)
		{
			jumpHook();
		}
	},

	portalsPlayer: function()
	{
		// player is in portal?
		if(bluePortalCreated && orangePortalCreated)
		{
			if(orangePortal.type == 4)
				entityIsInPortalOrange(Player.getEntity(), Player.getX(), Player.getY(), Player.getZ());
			else
				entityIsInPortalOrange(Player.getEntity(), Player.getX(), Player.getY() - 1, Player.getZ());

			if(bluePortal.type == 4)
				entityIsInPortalBlue(Player.getEntity(), Player.getX(), Player.getY(), Player.getZ());
			else
				entityIsInPortalBlue(Player.getEntity(), Player.getX(), Player.getY() - 1, Player.getZ());
		}
	},

	portalGunBullets: function()
	{
		if(blueBulletLaunched)
		{
			var xArrow = Entity.getX(blueBullet.entity);
			var yArrow = Entity.getY(blueBullet.entity);
			var zArrow = Entity.getZ(blueBullet.entity);
			if(blueBullet.previousX == xArrow && blueBullet.previousY == yArrow && blueBullet.previousZ == zArrow)
			{
				setPortalBlue(Math.floor(xArrow), Math.floor(yArrow), Math.floor(zArrow));

				Entity.remove(blueBullet.entity);
				blueBullet = null;
				blueBulletLaunched = false;
			} else
			{
				if(xArrow == 0 && yArrow == 0 && zArrow == 0)
				{
					// the blueBullet hit an entity
					Entity.remove(blueBullet.entity);
					blueBullet = null;
					blueBulletLaunched = false;
				} else
				{
					blueBullet.previousX = xArrow;
					blueBullet.previousY = yArrow;
					blueBullet.previousZ = zArrow;
				}
			}
		}

		if(orangeBulletLaunched)
		{
			var xArrow = Entity.getX(orangeBullet.entity);
			var yArrow = Entity.getY(orangeBullet.entity);
			var zArrow = Entity.getZ(orangeBullet.entity);
			if(orangeBullet.previousX == xArrow && orangeBullet.previousY == yArrow && orangeBullet.previousZ == zArrow)
			{
				setPortalOrange(Math.floor(xArrow), Math.floor(yArrow), Math.floor(zArrow));

				Entity.remove(orangeBullet.entity);
				orangeBullet = null;
				orangeBulletLaunched = false;
			} else
			{
				if(xArrow == 0 && yArrow == 0 && zArrow == 0)
				{
					// the orangeBullet hit an entity
					Entity.remove(orangeBullet.entity);
					orangeBullet = null;
					orangeBulletLaunched = false;
				} else
				{
					orangeBullet.previousX = xArrow;
					orangeBullet.previousY = yArrow;
					orangeBullet.previousZ = zArrow;
				}
			}
		}
	},

	portalGunPicking: function()
	{
		if(isPortalGunPicking)
		{
			if(pgIsBlock)
			{
				var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
				if(pgEntity != null)
					Entity.remove(pgEntity);
				pgEntity = Level.dropItem(Player.getX() + (dir.x * 2), Player.getY() + (dir.y * 2.5), Player.getZ() + (dir.z * 2), 0, pgBlockId, 1, pgBlockData);
			} else
			{
				var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
				if(Player.getX() + (dir.x * 3) - Entity.getX(pgEntity) > 0.5 ||  Player.getX() + (dir.x * 3) - Entity.getX(pgEntity) < -0.5 || Player.getY () + (dir.y * 3) - Entity.getY (pgEntity) > 0.5 ||  Player.getY () + (dir.y * 3) - Entity.getY (pgEntity) < -0.5 || Player.getZ () + (dir.z * 3) - Entity.getZ (pgEntity) > 0.5 ||  Player.getZ () + (dir.z * 3) - Entity.getZ (pgEntity) < -0.5)
				{
					Entity.setVelX(pgEntity, (Player.getX() + (dir.x * 3) - Entity.getX(pgEntity)) / 5)
					Entity.setVelY(pgEntity, (Player.getY() + (dir.y * 3) - Entity.getY(pgEntity)) / 5);
					Entity.setVelZ(pgEntity, (Player.getZ() + (dir.z * 3) - Entity.getZ(pgEntity)) / 5);
				} else
				{
					Entity.setVelX(pgEntity, 0);
					Entity.setVelY(pgEntity, 0);
					Entity.setVelZ(pgEntity, 0);
				}
			}
		}
	},

	gravityGun: function()
	{
		if(isGravityGunPicking)
		{
			if(ggIsBlock)
			{
				var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
				if(ggEntity != null)
					Entity.remove(ggEntity);
				ggEntity = Level.dropItem(Player.getX() + (dir.x * 2), Player.getY() + (dir.y * 2.5), Player.getZ() + (dir.z * 2), 0, ggBlockId, 1, ggBlockData);
			} else
			{
				var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
				if(Player.getX() + (dir.x * 3) - Entity.getX(ggEntity) > 0.5 ||  Player.getX() + (dir.x * 3) - Entity.getX(ggEntity) < -0.5 || Player.getY () + (dir.y * 3) - Entity.getY (ggEntity) > 0.5 ||  Player.getY () + (dir.y * 3) - Entity.getY (ggEntity) < -0.5 || Player.getZ () + (dir.z * 3) - Entity.getZ (ggEntity) > 0.5 ||  Player.getZ () + (dir.z * 3) - Entity.getZ (ggEntity) < -0.5)
				{
					Entity.setVelX(ggEntity, (Player.getX() + (dir.x * 3) - Entity.getX(ggEntity)) / 5)
					Entity.setVelY(ggEntity, (Player.getY() + (dir.y * 3) - Entity.getY(ggEntity)) / 5);
					Entity.setVelZ(ggEntity, (Player.getZ() + (dir.z * 3) - Entity.getZ(ggEntity)) / 5);
				} else
				{
					Entity.setVelX(ggEntity, 0);
					Entity.setVelY(ggEntity, 0);
					Entity.setVelZ(ggEntity, 0);
				}
			}
		}
	},

	placeShotBlocks: function()
	{
		for(var i in ggShotBlocksToBePlaced)
		{
			var entity = ggShotBlocksToBePlaced[i].entity;
			if(Entity.getX(entity) == ggShotBlocksToBePlaced[i].previousX && Entity.getY(entity) == ggShotBlocksToBePlaced[i].previousY && Entity.getZ(entity) == ggShotBlocksToBePlaced[i].previousZ)
			{
				if(!(Entity.getX(entity) == 0 && Entity.getY(entity) == 0 && Entity.getZ(entity) == 0)) // is entity already removed
				{
					Level.setTile(Math.floor(Entity.getX(entity)), Math.floor(Entity.getY(entity)), Math.floor(Entity.getZ(entity)), ggShotBlocksToBePlaced[i].id, ggShotBlocksToBePlaced[i].data);
					Entity.remove(entity);
				}
				ggShotBlocksToBePlaced.splice(i, 1);
			} else
			{
				ggShotBlocksToBePlaced[i].previousX = Entity.getX(entity);
				ggShotBlocksToBePlaced[i].previousY = Entity.getY(entity);
				ggShotBlocksToBePlaced[i].previousZ = Entity.getZ(entity);
			}
		}
	},

	gelBlue: function(blockUnderPlayer)
	{
		if(blockUnderPlayer == REPULSION_GEL_ID)
		{
			if(velBeforeY < -0.666) // Satan confirmed!
			{
				Entity.setVelY(Player.getEntity(), -velBeforeY);
				makeBounceSound();
			}

			Entity.addEffect(Player.getEntity(), MobEffect.jump, 2, 5, false, false);
		}
	},

	gelOrange: function(blockUnderPlayer)
	{
		if(blockUnderPlayer == PROPULSION_GEL_ID)
		{
			currentActivity.runOnUiThread(new java.lang.Runnable(
			{
				run: function()
				{
					new android.os.Handler().postDelayed(new java.lang.Runnable(
					{
						run: function()
						{
							if(isInGame)
							{
								Entity.setVelX(Player.getEntity(), Entity.getVelX(Player.getEntity()) * speedMultiplier);
								Entity.setVelZ(Player.getEntity(), Entity.getVelZ(Player.getEntity()) * speedMultiplier);
									
								if(speedMultiplier < SPEED_MULTIPLIER_MAX)
									speedMultiplier = speedMultiplier + 0.025;
							}
						}
					}), ((speedMultiplier - SPEED_MULTIPLIER_MIN) * 1000));
				}
			}));		
		}else
		{
			if(speedMultiplier != SPEED_MULTIPLIER_MIN)
				speedMultiplier = SPEED_MULTIPLIER_MIN;
		}
	},

	jukebox: function()
	{
		for(var i in jukeboxes)
		{
			jukeboxes[i].countdown++;
			if(jukeboxes[i].countdown >= 10)
			{
				jukeboxes[i].countdown = 0;
				var distancePJ = Math.sqrt( (Math.pow(jukeboxes[i].x - Player.getX(), 2)) + (Math.pow(jukeboxes[i].y - Player.getY(), 2)) + (Math.pow(jukeboxes[i].z - Player.getZ(), 2) ));
				if(distancePJ > MAX_LOGARITHMIC_VOLUME_JUKEBOX)
				{
					jukeboxes[i].player.setVolume(0.0, 0.0);
				}
				else
				{
					var volume = 1 - (Math.log(distancePJ) / Math.log(MAX_LOGARITHMIC_VOLUME_JUKEBOX));
					jukeboxes[i].player.setVolume(volume, volume);
				}
			}
		}
	},

	jumper: function(blockUnderPlayer)
	{
		if(blockUnderPlayer == JUMPER_ID)
		{
			var random = Math.floor((Math.random() * 4) + 3);
			Sound.playFromFileName("jumper/alyx_gun_fire" + random + ".wav");

			var jumperDir = getDirection(getYaw(), 0);
			Entity.setVelX(Player.getEntity(), jumperDir.x * 1.8);
			Entity.setVelY(Player.getEntity(), 1.27); // cos(45) * 1.8
			Entity.setVelZ(Player.getEntity(), jumperDir.z * 1.8);
		}
	},

	longFallBoots: function(blockUnderPlayer)
	{
		if(Player.getArmorSlot(3) == LONG_FALL_BOOTS_ID)
		{
			// player will hit the ground soon
			if(isFalling && blockUnderPlayer > 0)
			{
				if(Entity.getVelY(Player.getEntity()) == VEL_Y_OFFSET)
				{
					// STOP Long Fall Boots
					isFalling = false;

					if(Level.getGameMode() == GameMode.SURVIVAL)
					{
						// Entity.removeEffect(entity, id) doesn't remove particles of the effect https://github.com/zhuowei/MCPELauncher/issues/241
						//Entity.removeEffect(Player.getEntity(), MobEffect.jump);
						Entity.removeAllEffects(Player.getEntity());
					}

					makeLongFallBootsSound();
				}
			}

			// player is falling
			if(Entity.getVelY(Player.getEntity()) <= -0.5)
			{
				// START Long Fall Boots
				isFalling = true;

				if(Level.getGameMode() == GameMode.SURVIVAL)
					Entity.addEffect(Player.getEntity(), MobEffect.jump, 999999, 254, false, false);
			}
		} else
		{
			if(isFalling)
			{
				// STOP Long Fall Boots
				isFalling = false;

				if(Level.getGameMode() == GameMode.SURVIVAL)
				{
					// Entity.removeEffect(entity, id) doesn't remove particles of the effect https://github.com/zhuowei/MCPELauncher/issues/241
					//Entity.removeEffect(Player.getEntity(), MobEffect.jump);
					Entity.removeAllEffects(Player.getEntity());
				}
			}
		}
	},

	radio: function()
	{
		if(isRadioPlaying)
		{
			radioCountdown++;
			if(radioCountdown >= 10)
			{
				radioCountdown = 0;
				var distancePR = Math.sqrt( (Math.pow(radioX - Player.getX(), 2)) + (Math.pow(radioY - Player.getY(), 2)) + (Math.pow(radioZ - Player.getZ(), 2) ));
				if(distancePR > MAX_LOGARITHMIC_VOLUME)
				{
					stopRadioMusic();
				}else
				{
					radioVolume = 1 - (Math.log(distancePR) / Math.log(MAX_LOGARITHMIC_VOLUME));
					radioPlayer.setVolume(radioVolume, radioVolume);
				}
			}
		}
	}
};


//########################################################################################################################################################
// Added functions (No GUI and No render)
//########################################################################################################################################################

//########## PORTAL GUN GENERAL functions ##########
function isItemPortalGun(itemId)
{
	//
	return (itemId == PORTAL_GUN_BLUE_ID || itemId == PORTAL_GUN_GOLD_ID || itemId == PORTAL_GUN_IRON_ID || itemId == PORTAL_GUN_LAVA_ID || itemId == PORTAL_GUN_ORANGE_ID);
}

function showPortalGunUI()
{
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				var layoutLeft = new android.widget.LinearLayout(currentActivity);
				layoutLeft.setOrientation(android.widget.LinearLayout.VERTICAL);

				var blueImage = scaleImageToSize(bluePortalScaled, bluePortalScaled.getWidth() * 0.166, bluePortalScaled.getHeight() * 0.166, true);
				var blueImageView = new android.widget.ImageView(currentActivity);
				blueImageView.setImageBitmap(blueImage);
				blueImageView.setOnClickListener(new android.view.View.OnClickListener(
				{
					onClick: function()
					{
						if(blueBulletLaunched)
						{
							Entity.remove(blueBullet.entity);
							blueBullet = null;
							blueBulletLaunched = false;
						}
						shootBluePortal();
					}
				}));
				layoutLeft.addView(blueImageView);
				setMarginsLinearLayout(blueImageView, 0, 0, 0, MARGIN_HORIZONTAL_SMALL);

				// PICK BUTTONS
				if(minecraftStyleForButtons)
				{
					pgPickButtonFalse = MinecraftButton(buttonsSize);
					pgPickButtonFalse.setText("Pick");
				} else
				{
					pgPickButtonFalse = defaultColoredMinecraftButton("pick", "#FF929292");
				}
				pgPickButtonFalse.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						setPickEnabledPortalGun(true);
					}
				});
				pgPickButtonFalse.setSoundEffectsEnabled(false);

				if(minecraftStyleForButtons)
				{
					pgPickButtonTrue = MinecraftButton(buttonsSize);
					pgPickButtonTrue.setText("Pick");
				} else
				{
					pgPickButtonTrue = defaultColoredMinecraftButton("pick", "#FFFFFFFF");
				}
				pgPickButtonTrue.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						setPickEnabledPortalGun(false);
					}
				});
				pgPickButtonTrue.setSoundEffectsEnabled(false);

				layoutLeft.addView(pgPickButtonFalse);
				layoutLeft.addView(pgPickButtonTrue);
				pgPickButtonTrue.setVisibility(android.view.View.GONE);

				popupPortalGunPick = new android.widget.PopupWindow(layoutLeft, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
				popupPortalGunPick.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
				popupPortalGunPick.showAtLocation(currentActivity.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.CENTER, 0, pixelsOffsetButtons);
				// PICK BUTTONS - END



				// OVERLAY IMAGE
				displayOverlay();
				// OVERLAY IMAGE - END



				var layoutRight = new android.widget.LinearLayout(currentActivity);
				layoutRight.setOrientation(android.widget.LinearLayout.VERTICAL);

				var orangeImage = scaleImageToSize(orangePortalScaled, orangePortalScaled.getWidth() * 0.166, orangePortalScaled.getHeight() * 0.166, true);
				var orangeImageView = new android.widget.ImageView(currentActivity);
				orangeImageView.setImageBitmap(orangeImage);
				orangeImageView.setOnClickListener(new android.view.View.OnClickListener(
				{
					onClick: function()
					{
						if(orangeBulletLaunched)
						{
							Entity.remove(orangeBullet.entity);
							orangeBullet = null;
							orangeBulletLaunched = false;
						}
						shootOrangePortal();
					}
				}));
				layoutRight.addView(orangeImageView);
				setMarginsLinearLayout(orangeImageView, 0, 0, 0, MARGIN_HORIZONTAL_SMALL);

				// DROP BUTTONS
				if(minecraftStyleForButtons)
				{
					pgDropButtonFalse = MinecraftButton(buttonsSize);
					pgDropButtonFalse.setText("Drop");
				} else
				{
					pgDropButtonFalse = defaultColoredMinecraftButton("drop", "#FF929292");
				}
				pgDropButtonFalse.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						Sound.playFromFileName("gravitygun/fail.ogg");
						ModPE.showTipMessage("You are not picking any entity.");
					}
				});
				pgDropButtonFalse.setSoundEffectsEnabled(false);

				if(minecraftStyleForButtons)
				{
					pgDropButtonTrue = MinecraftButton(buttonsSize);
					pgDropButtonTrue.setText("Drop");
				} else
				{
					pgDropButtonTrue = defaultColoredMinecraftButton("drop", "#FFFFFFFF");
				}
				pgDropButtonTrue.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						dropPortalGun();
					}
				});
				pgDropButtonTrue.setSoundEffectsEnabled(false);

				layoutRight.addView(pgDropButtonFalse);
				layoutRight.addView(pgDropButtonTrue);
				pgDropButtonTrue.setVisibility(android.view.View.GONE);

				popupPortalGunDrop = new android.widget.PopupWindow(layoutRight, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
				popupPortalGunDrop.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
				popupPortalGunDrop.showAtLocation(currentActivity.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.CENTER, 0, pixelsOffsetButtons);
				// DROP BUTTONS - END
			} catch(err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}

function shootBluePortal()
{
	Sound.playFromFileName("portalgun/portalgun_shoot_red1.wav");

	var gunShootDir = getDirection(getYaw(), getPitch());
	var bullet = Level.spawnMob(Player.getX() + (gunShootDir.x * 2), Player.getY() + (gunShootDir.y * 2.5), Player.getZ() + (gunShootDir.z * 2), 80);
	var speed = getPortalGunBulletSpeed(Player.getCarriedItem());
	Entity.setVelX(bullet, gunShootDir.x * speed);
	Entity.setVelY(bullet, gunShootDir.y * speed);
	Entity.setVelZ(bullet, gunShootDir.z * speed);
	if(Player.getCarriedItem() == PORTAL_GUN_LAVA_ID)
		Entity.setFireTicks(bullet, 100);
	//Entity.setRenderType(bullet, 18);
	
	if(Level.getGameMode() == GameMode.SURVIVAL)
		Player.damageCarriedItem();

	changeCarriedPortalGunColor(); // change the carried item if necessary

	blueBullet = new EntityClass(bullet);
	blueBulletLaunched = true;
}

function shootOrangePortal()
{
	Sound.playFromFileName("portalgun/portalgun_shoot_blue1.wav");

	var gunShootDir = getDirection(getYaw(), getPitch());
	var bullet = Level.spawnMob(Player.getX() + (gunShootDir.x * 2), Player.getY() + (gunShootDir.y * 2.5), Player.getZ() + (gunShootDir.z * 2), 80);
	var speed = getPortalGunBulletSpeed(Player.getCarriedItem());
	Entity.setVelX(bullet, gunShootDir.x * speed);
	Entity.setVelY(bullet, gunShootDir.y * speed);
	Entity.setVelZ(bullet, gunShootDir.z * speed);
	if(Player.getCarriedItem() == PORTAL_GUN_LAVA_ID)
		Entity.setFireTicks(bullet, 100);
	//Entity.setRenderType(bullet, 18);
	
	if(Level.getGameMode() == GameMode.SURVIVAL)
		Player.damageCarriedItem();

	changeCarriedPortalGunColor(); // change the carried item if necessary

	orangeBullet = new EntityClass(bullet);
	orangeBulletLaunched = true;
}

function getPortalGunBulletSpeed(portalGun)
{
	if(portalGun == PORTAL_GUN_BLUE_ID || portalGun == PORTAL_GUN_ORANGE_ID)
		return 3;
	if(portalGun == PORTAL_GUN_GOLD_ID)
		return 1.8;
	if(portalGun == PORTAL_GUN_IRON_ID)
		return 1.2;
	if(portalGun == PORTAL_GUN_LAVA_ID)
		return 1.2;
}

function changeCarriedPortalGunColor()
{
	if(Player.getCarriedItem() == PORTAL_GUN_BLUE_ID || Player.getCarriedItem() == PORTAL_GUN_ORANGE_ID)
	{
		if(Player.getCarriedItem() == PORTAL_GUN_BLUE_ID)
			Entity.setCarriedItem(Player.getEntity(), PORTAL_GUN_ORANGE_ID, Player.getCarriedItemCount(), Player.getCarriedItemData());
		else
			Entity.setCarriedItem(Player.getEntity(), PORTAL_GUN_BLUE_ID,  Player.getCarriedItemCount(), Player.getCarriedItemData());
	}
}

function removePortalGunUI()
{
	pgIsPickingEnabled = false;
	isPortalGunPicking = false;
	pgEntity = null;
	showingOverlayID = 0;
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			try
			{
				popupPortalGunPick.dismiss();
				popupPortalGunDrop.dismiss();
				popupOverlay.dismiss();
			} catch(err) { /* Portal Gun not in hand */ }
		}
	}));
}
//########## PORTAL GUN GENERAL functions - END ##########


//########## PORTAL GUN OVERLAY functions ##########
function displayOverlay()
{
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			/*var correctOverlayImage = getOverlayFromID(getCurrentOverlayID());
			var overlayImage = scaleImageToSize(correctOverlayImage, correctOverlayImage.getWidth() * 0.5, correctOverlayImage.getHeight() * 0.5, true);*/
			overlayImageView = new android.widget.ImageView(currentActivity);
			showingOverlayID = 0;
			updateOverlay();
			//overlayImageView.setImageBitmap(overlayImage);

			popupOverlay = new android.widget.PopupWindow(overlayImageView, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
			popupOverlay.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
			popupOverlay.setOutsideTouchable(false);
			popupOverlay.setFocusable(false);
			popupOverlay.setTouchable(false);
			popupOverlay.showAtLocation(currentActivity.getWindow().getDecorView(), android.view.Gravity.CENTER | android.view.Gravity.CENTER, 0, 0);
		}
	}));
}

function updateOverlay()
{
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			try
			{
				var overlayID = getCurrentOverlayID();
				if(showingOverlayID != overlayID)
				{
					var correctOverlayImage = getOverlayFromID(overlayID);
					var overlayImage = scaleImageToSize(correctOverlayImage, correctOverlayImage.getWidth() * 0.5, correctOverlayImage.getHeight() * 0.5, true);
					overlayImageView.setImageBitmap(overlayImage);

					showingOverlayID = overlayID;
				}
			} catch (e) { }
		}
	}));
}

function getCurrentOverlayID()
{
	if(bluePortalCreated && orangePortalCreated)
	{
		return OVERLAY_FULL;
	} else
	{
		if(bluePortalCreated)
			return OVERLAY_BLUE;
		if(orangePortalCreated)
			return OVERLAY_ORANGE;

		return OVERLAY_BLANK;
	}
}

function getOverlayFromID(id)
{
	switch(id)
	{
		case OVERLAY_FULL:
		{
			return overlayFullScaled;
		}
		case OVERLAY_BLUE:
		{
			return overlayBlueScaled;
		}
		case OVERLAY_ORANGE:
		{
			return overlayOrangeScaled;
		}
		case OVERLAY_BLANK:
		{
			return overlayBlankScaled;
		}
	}
}
//########## PORTAL GUN OVERLAY functions - END ##########


//########## PORTAL GUN PICK & DROP functions ##########
function setPickEnabledPortalGun(enable)
{
	if(enable)
	{
		pgIsPickingEnabled = true;
		pgPickButtonFalse.setVisibility(android.view.View.GONE);
		pgPickButtonTrue.setVisibility(android.view.View.VISIBLE);
	} else
	{
		pgIsPickingEnabled = false;
		pgPickButtonFalse.setVisibility(android.view.View.VISIBLE);
		pgPickButtonTrue.setVisibility(android.view.View.GONE);
	}
}

function pickBlockPortalGun(id, data)
{
	if(!isPortalGunPicking)
	{
		pgIsBlock = true;
		pgBlockId = id;
		pgBlockData = data;

		pickWithPortalGun();
	}
}

function pickEntityPortalGun(entity)
{
	if(!isPortalGunPicking)
	{
		pgIsBlock = false;
		pgEntity = entity;
		
		pickWithPortalGun();
	}
}

function pickWithPortalGun()
{
	if(!isPortalGunPicking)
	{		
		isPortalGunPicking = true;
		updateDropButtonPortalGun();
		if(Level.getGameMode() == GameMode.SURVIVAL)
			Player.damageCarriedItem();
		Sound.playFromFileName("gravitygun/pickup.ogg");
	}
}

function updateDropButtonPortalGun()
{
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			if(isPortalGunPicking)
			{
				pgDropButtonFalse.setVisibility(android.view.View.GONE);
				pgDropButtonTrue.setVisibility(android.view.View.VISIBLE);
			} else
			{
				pgDropButtonFalse.setVisibility(android.view.View.VISIBLE);
				pgDropButtonTrue.setVisibility(android.view.View.GONE);
			}
		}
	}));
}

function dropPortalGun()
{
	if(pgIsBlock)
	{
		var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
		var x = Player.getX() + (dir.x * 2);
		var y = Player.getY() + (dir.y * 2.5);
		var z = Player.getZ() + (dir.z * 2);
		if(Level.getTile(Math.floor(x), Math.floor(y), Math.floor(z)) == 0)
		{
			isPortalGunPicking = false;
			Sound.playFromFileName("gravitygun/drop.ogg");
			updateDropButtonPortalGun();

			Level.setTileNotInAir(x, y, z, pgBlockId, pgBlockData);
			Entity.remove(pgEntity);
			pgEntity = null;
		} else
		{
			Sound.playFromFileName("gravitygun/fail.ogg");
			ModPE.showTipMessage("There is another block in this position.");
		}
	} else
	{
		isPortalGunPicking = false;
		Sound.playFromFileName("gravitygun/drop.ogg");
		updateDropButtonPortalGun();
		pgEntity = null;
	}
}
//########## PORTAL GUN PICK & DROP functions - END ##########


//########## PORTAL functions ##########
// WARNING: the following code is crap, I wrote it when I was 16 but now I'm too lazy to rewrite it. Sorry!
function entityIsInPortalOrange(entity, x, y, z)
{
	if((x > orangePortal.x1 && x < (orangePortal.x1 + 1) && y > orangePortal.y1 && y < (orangePortal.y1 + 1) && z > orangePortal.z1 && z < (orangePortal.z1 + 1)) || (x > orangePortal.x2 && x < (orangePortal.x2 + 1) && y > orangePortal.y2 && y < (orangePortal.y2 + 1) && z > orangePortal.z2 && z < (orangePortal.z2 + 1)))
	{
		var random = Math.floor((Math.random() * 2) + 1);
		Sound.playFromFileName("portals/portal_exit" + random + ".wav");
		if(orangePortal.type == 2)
		{
			if(bluePortal.type == 2)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 - 1);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
			if(bluePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 1);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
			if(bluePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(bluePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 - 0.05, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);
			}
			if(bluePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
			if(bluePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 - 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
		}else

		if(orangePortal.type == 1)
		{
			if(bluePortal.type == 2)
			{	
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 - 1);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
			if(bluePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 1);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
			if(bluePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(bluePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 - 0.05, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);	
			}
			if(bluePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
			if(bluePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 - 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
		}else

		if(orangePortal.type == 3)
		{
			if(bluePortal.type == 2)
			{
				Entity.setRot(entity, 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 - 1);
				if(entity == Player.getEntity())
					Entity.setVelZ(entity, velBeforeY);
				else
					Entity.setVelZ(entity, -0.2);
				Entity.setVelY(entity, 0);
			}
			if(bluePortal.type == 1)
			{
				Entity.setRot(entity, 360, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 1);
				if(entity == Player.getEntity())
					Entity.setVelZ(entity, -velBeforeY);
				else
					Entity.setVelZ(entity, 0.2);
				Entity.setVelY(entity, 0);
			}
			if(bluePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				if(entity == Player.getEntity())
					Entity.setVelY(entity, -velBeforeY);
				else
					Entity.setVelY(entity, 0.5);
			}
			if(bluePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 - 0.05, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				if(entity == Player.getEntity())
					Entity.setVelY(entity, Entity.getVelY(velBeforeY) - 0.15);
				else
					Entity.setVelY(entity, 0);
				Entity.setVelZ(entity, Entity.getVelZ(entity));	
			}
			if(bluePortal.type == 5)
			{
				Entity.setRot(entity, 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				if(entity == Player.getEntity())
					Entity.setVelX(entity, -velBeforeY);
				else
					Entity.setVelX(entity, 0.2);
				Entity.setVelY(entity, 0);
			}
			if(bluePortal.type == 6)
			{
				Entity.setRot(entity, 450, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 - 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				if(entity == Player.getEntity())
					Entity.setVelX(entity, velBeforeY);
				else
					Entity.setVelX(entity, -0.2);
				Entity.setVelY(entity, 0);
			}
		}else

		if(orangePortal.type == 4)
		{
			if(bluePortal.type == 2)
			{
				Entity.setRot(entity, 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 - 1);
				Entity.setVelZ(entity, -0.2);
			}
			if(bluePortal.type == 1)
			{
				Entity.setRot(entity, 360, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 1);
				Entity.setVelZ(entity, 0.2);
			}
			if(bluePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelY(entity, 0.5);
				Entity.setVelZ(entity, Entity.getVelZ(entity));	
			}
			if(bluePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 - 0.05, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelY(entity, Entity.getVelY(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));	
			}
			if(bluePortal.type == 5)
			{
				Entity.setRot(entity, 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, 0.2);
			}
			if(bluePortal.type == 6)
			{
				Entity.setRot(entity, 450, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 - 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, -0.2);
			}
		}else

		if(orangePortal.type == 5)
		{
			if(bluePortal.type == 2)
			{	
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 - 1);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
			if(bluePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 1);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
			if(bluePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(bluePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 - 0.05, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);	
			}
			if(bluePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
			if(bluePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 - 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
		}else

		if(orangePortal.type == 6)
		{
			if(bluePortal.type == 2)
			{	
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 - 1);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
			if(bluePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 1);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
			if(bluePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(bluePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 0.5, bluePortal.y1 - 0.05, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);
			}
			if(bluePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 + 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
			if(bluePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, bluePortal.x1 - 1, bluePortal.y1 + 2, bluePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
		}
	}
}

function entityIsInPortalBlue(entity, x, y, z)
{
	if((x > bluePortal.x1 && x < (bluePortal.x1 + 1) && y > bluePortal.y1 && y < (bluePortal.y1 + 1) && z > bluePortal.z1 && z < (bluePortal.z1 + 1)) || (x > bluePortal.x2 && x < (bluePortal.x2 + 1) && y > bluePortal.y2 && y < (bluePortal.y2 + 1) && z > bluePortal.z2 && z < (bluePortal.z2 + 1)))
	{
		var random = Math.floor((Math.random() * 2) + 1);
		Sound.playFromFileName("portals/portal_exit" + random + ".wav");
		if(bluePortal.type == 2)
		{
			if(orangePortal.type == 2)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 - 1);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
			if(orangePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 1);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
			if(orangePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(orangePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 - 0.05, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);
			}
			if(orangePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
			if(orangePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 - 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
		}else

		if(bluePortal.type == 1)
		{
			if(orangePortal.type == 2)
			{	
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 - 1);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
			if(orangePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 1);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
			if(orangePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(orangePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 - 0.05, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);	
			}
			if(orangePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
			if(orangePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 - 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
		}else

		if(bluePortal.type == 3)
		{
			if(orangePortal.type == 2)
			{
				Entity.setRot(entity, 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 - 1);
				if(entity == Player.getEntity())
					Entity.setVelZ(entity, velBeforeY);
				else
					Entity.setVelZ(entity, -0.2);
				Entity.setVelY(entity, 0);
			}
			if(orangePortal.type == 1)
			{
				Entity.setRot(entity, 360, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 1);
				if(entity == Player.getEntity())
					Entity.setVelZ(entity, -velBeforeY);
				else
					Entity.setVelZ(entity, 0.2);
				Entity.setVelY(entity, 0);
			}
			if(orangePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				if(entity == Player.getEntity())
					Entity.setVelY(entity, -velBeforeY);
				else
					Entity.setVelY(entity, 0.5);
			}
			if(orangePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 - 0.05, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				if(entity == Player.getEntity())
					Entity.setVelY(entity, Entity.getVelY(velBeforeY) - 0.15);
				else
					Entity.setVelY(entity, 0);
				Entity.setVelZ(entity, Entity.getVelZ(entity));	
			}
			if(orangePortal.type == 5)
			{
				Entity.setRot(entity, 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				if(entity == Player.getEntity())
					Entity.setVelX(entity, -velBeforeY);
				else
					Entity.setVelX(entity, 0.2);
				Entity.setVelY(entity, 0);
			}
			if(orangePortal.type == 6)
			{
				Entity.setRot(entity, 450, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 - 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				if(entity == Player.getEntity())
					Entity.setVelX(entity, velBeforeY);
				else
					Entity.setVelX(entity, -0.2);
				Entity.setVelY(entity, 0);
			}
		}else

		if(bluePortal.type == 4)
		{
			if(orangePortal.type == 2)
			{
				Entity.setRot(entity, 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 - 1);
				Entity.setVelZ(entity, -0.2);
			}
			if(orangePortal.type == 1)
			{
				Entity.setRot(entity, 360, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 1);
				Entity.setVelZ(entity, 0.2);
			}
			if(orangePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelY(entity, 0.5);
				Entity.setVelZ(entity, Entity.getVelZ(entity));	
			}
			if(orangePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 - 0.05, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelY(entity, Entity.getVelY(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));	
			}
			if(orangePortal.type == 5)
			{
				Entity.setRot(entity, 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, 0.2);
			}
			if(orangePortal.type == 6)
			{
				Entity.setRot(entity, 450, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 - 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, -0.2);
			}
		}else

		if(bluePortal.type == 5)
		{
			if(orangePortal.type == 2)
			{	
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 - 1);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
			if(orangePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 1);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
			if(orangePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(orangePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 - 0.05, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);	
			}
			if(orangePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
			if(orangePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 - 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
		}else

		if(bluePortal.type == 6)
		{
			if(orangePortal.type == 2)
			{	
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 - 1);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelZ(entity, -Entity.getVelX(entity));
			}
			if(orangePortal.type == 1)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 90, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 1);
				Entity.setVelX(entity, -Entity.getVelZ(entity));
				Entity.setVelZ(entity, Entity.getVelX(entity));
			}
			if(orangePortal.type == 3)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelZ(entity));
				Entity.setVelY(entity, 0.6);
				Entity.setVelZ(entity, -0.4);	
			}
			if(orangePortal.type == 4)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 270, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 0.5, orangePortal.y1 - 0.05, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, 0);
				Entity.setVelY(entity, -0.15);
				Entity.setVelZ(entity, 0);
			}
			if(orangePortal.type == 5)
			{
				Entity.setRot(entity, Entity.getYaw(entity), Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 + 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, Entity.getVelX(entity));
				Entity.setVelZ(entity, Entity.getVelZ(entity));
			}
			if(orangePortal.type == 6)
			{
				Entity.setRot(entity, Entity.getYaw(entity) + 180, Entity.getPitch(entity));
				Entity.setPosition(entity, orangePortal.x1 - 1, orangePortal.y1 + 2, orangePortal.z1 + 0.5);
				Entity.setVelX(entity, -Entity.getVelX(entity));
				Entity.setVelZ(entity, -Entity.getVelZ(entity));
			}
		}
	}
}

function setPortalOrange(x, y ,z)
{
	var pX = Player.getX();
	var pY = Player.getY();
	var pZ = Player.getZ();

	if(Level.getTile(x, y ,z) != 0)
	{
		clientMessage("error bullet in a block");
	}else
	{
		//ARROW
		if(Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
		{
			if(Level.getTile(x, y - 1, z) != 0)
			{
				Level.setTile(x, y, z, ORANGE_Y_MIN_U);
				Level.setTile(x, y, z + 1, ORANGE_Y_MIN_D);
				savePortalAndDeleteOrange(x, y, z, x, y, z+1, 3);
				return;
			}else
			if(Level.getTile(x, y + 1, z) != 0)
			{
				Level.setTile(x, y, z, ORANGE_Y_MAX_U);
				Level.setTile(x, y, z + 1, ORANGE_Y_MAX_D);
				savePortalAndDeleteOrange(x, y, z, x, y, z+1, 4);
				return;
			}
		}else
		{
			if(Level.getTile(x + 1, y, z) != 0 && Level.getTile(x - 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, ORANGE_X_MAX_D, 0);
					Level.setTile(x, y + 1, z, ORANGE_X_MAX_U, 0);
					savePortalAndDeleteOrange(x, y, z, x, y+1, z, 6);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MAX_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_X_MAX_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z, 6);
						return;
					}
				}
			}
			if(Level.getTile(x, y, z + 1) != 0 && Level.getTile(x, y, z - 1) == 0 && Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, ORANGE_Z_MAX_D, 0);
					Level.setTile(x, y + 1, z, ORANGE_Z_MAX_U, 0);
					savePortalAndDeleteOrange(x, y, z, x, y+1, z, 2);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MAX_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_Z_MAX_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z, 2);
						return;
					}
				}
			}
			if(Level.getTile(x - 1, y, z) != 0 && Level.getTile(x + 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, ORANGE_X_MIN_D, 0);
					Level.setTile(x, y + 1, z, ORANGE_X_MIN_U, 0);
					savePortalAndDeleteOrange(x, y, z, x, y+1, z, 5);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MIN_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_X_MIN_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z, 5);
						return;
					}
				}
			}
			if(Level.getTile(x, y, z - 1) != 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, ORANGE_Z_MIN_D, 0);
					Level.setTile(x, y + 1, z, ORANGE_Z_MIN_U, 0);
					savePortalAndDeleteOrange(x, y, z, x, y+1, z, 1);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MIN_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_Z_MIN_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z, 1);
						return;
					}
				}
			}
			if(pX < x && pZ < z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MAX_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_X_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 6);
					return;
					} else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 6);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 2);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 2);
							return;
						}
					}
				}
			}
			if(pX < x && pZ >= z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MAX_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_X_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 6);
					return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 6);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 1);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 1);
							return;
						}
					}
				}
			}
			if(pX >= x && pZ >= z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MIN_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_X_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 5);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 5);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 1);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 1);
							return;
						}
					}
				}
			}
			if(pX >= x && pZ < z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MIN_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_X_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 5);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 5);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z, 2);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z, 2);
							return;
						}
					}
				}
			}
		}
	}
}

function setPortalBlue(x, y ,z)
{
	var pX = Player.getX();
	var pY = Player.getY();
	var pZ = Player.getZ();

	if(Level.getTile(x, y ,z) != 0)
	{
		clientMessage("error bullet in a block");
	}else
	{
		//ARROW
		if(Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
		{
			if(Level.getTile(x, y - 1, z) != 0)
			{
				Level.setTile(x, y, z, BLUE_Y_MIN_U);
				Level.setTile(x, y, z + 1, BLUE_Y_MIN_D);
				savePortalAndDeleteBlue(x, y, z, x, y, z+1, 3);
			return;
			}else
			if(Level.getTile(x, y + 1, z) != 0)
			{
				Level.setTile(x, y, z, BLUE_Y_MAX_U);
				Level.setTile(x, y, z + 1, BLUE_Y_MAX_D);
				savePortalAndDeleteBlue(x, y, z, x, y, z+1, 4);
				return;
			}
		}else
		{
			if(Level.getTile(x + 1, y, z) != 0 && Level.getTile(x - 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, BLUE_X_MAX_D, 0);
					Level.setTile(x, y + 1, z, BLUE_X_MAX_U, 0);
					savePortalAndDeleteBlue(x, y, z, x, y+1, z, 6);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MAX_U, 0);
						Level.setTile(x, y - 1, z, BLUE_X_MAX_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z, 6);
						return;
					}
				}
			}
			if(Level.getTile(x, y, z + 1) != 0 && Level.getTile(x, y, z - 1) == 0 && Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, BLUE_Z_MAX_D, 0);
					Level.setTile(x, y + 1, z, BLUE_Z_MAX_U, 0);
					savePortalAndDeleteBlue(x, y, z, x, y+1, z, 2);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MAX_U, 0);
						Level.setTile(x, y - 1, z, BLUE_Z_MAX_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z, 2);
						return;
					}
				}
			}
			if(Level.getTile(x - 1, y, z) != 0 && Level.getTile(x + 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, BLUE_X_MIN_D, 0);
					Level.setTile(x, y + 1, z, BLUE_X_MIN_U, 0);
					savePortalAndDeleteBlue(x, y, z, x, y+1, z, 5);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MIN_U, 0);
						Level.setTile(x, y - 1, z, BLUE_X_MIN_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z, 5);
						return;
					}
				}
			}
			if(Level.getTile(x, y, z - 1) != 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0)
			{

				if(Level.getTile(x, y + 1, z) == 0)
				{
					Level.setTile(x, y, z, BLUE_Z_MIN_D, 0);
					Level.setTile(x, y + 1, z, BLUE_Z_MIN_U, 0);
					savePortalAndDeleteBlue(x, y, z, x, y+1, z, 1);
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MIN_U, 0);
						Level.setTile(x, y - 1, z, BLUE_Z_MIN_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z, 1);
						return;
					}
				}
			}
			if(pX < x && pZ < z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MAX_D, 0);
						Level.setTile(x, y + 1, z, BLUE_X_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 6);
					return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 6);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 2);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 2);
							return;
						}
					}
				}
			}
			if(pX < x && pZ >= z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MAX_D, 0);
						Level.setTile(x, y + 1, z, BLUE_X_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 6);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 6);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 1);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 1);
							return;
						}
					}
				}
			}
			if(pX >= x && pZ >= z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MIN_D, 0);
						Level.setTile(x, y + 1, z, BLUE_X_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 5);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 5);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 1);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 1);
							return;
						}
					}
				}
			}
			if(pX >= x && pZ < z)
			{
				if(Math.abs(pX - x) > Math.abs(pZ - z))
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MIN_D, 0);
						Level.setTile(x, y + 1, z, BLUE_X_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 5);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 5);
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z, 2);
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z, 2);
							return;
						}
					}
				}
			}
		}
	}
}
// END CRAP

function savePortalAndDeleteOrange(x1, y1, z1, x2, y2, z2, type)
{
	deleteOrangePortal();
	orangePortal = new PortalClass(x1, y1, z1, x2, y2, z2, type);
	orangePortalCreated = true;
	updateOverlay();
	// TODO save portals on sdcard
}

function savePortalAndDeleteBlue(x1, y1, z1, x2, y2, z2, type)
{
	deleteBluePortal();
	bluePortal = new PortalClass(x1, y1, z1, x2, y2, z2, type);
	bluePortalCreated = true;
	updateOverlay();
	// TODO save portals on sdcard
}

function deleteBluePortal()
{
	if(bluePortal != null)
	{
		Level.setTile(bluePortal.x1, bluePortal.y1, bluePortal.z1, 0);
		Level.setTile(bluePortal.x2, bluePortal.y2, bluePortal.z2, 0);
	}
	bluePortalCreated = false;
}

function deleteOrangePortal()
{
	if(orangePortal != null)
	{
		Level.setTile(orangePortal.x1, orangePortal.y1, orangePortal.z1, 0);
		Level.setTile(orangePortal.x2, orangePortal.y2, orangePortal.z2, 0);
	}
	orangePortalCreated = false;
}
//########## PORTAL functions - END ##########


//########## PORTAL GUN & GRAVITY GUN functions ##########
function canBlockBePicked(blockId)
{
	//
	return (pickBlocksBlacklist.indexOf(blockId) == -1 && pickBuggedBlocksBlacklist.indexOf(blockId) == -1);
}
//########## PORTAL GUN & GRAVITY GUN functions - END ##########


//########## GRAVITY GUN functions ##########
function initializeAndShowGravityGunUI()
{
	Sound.playFromFileName("gravitygun/equip.ogg");

	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				// SHOOT BUTTONS
				var layoutShoot = new android.widget.LinearLayout(currentActivity);
				layoutShoot.setOrientation(android.widget.LinearLayout.VERTICAL);

				if(minecraftStyleForButtons)
				{
					ggShootButtonFalse = MinecraftButton(buttonsSize);
					ggShootButtonFalse.setText("Shoot");
				} else
				{
					ggShootButtonFalse = defaultColoredMinecraftButton("shoot", "#FF929292");
				}
				ggShootButtonFalse.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						Sound.playFromFileName("gravitygun/fail.ogg");
						ModPE.showTipMessage("You are not picking any entity.");
					}
				});
				ggShootButtonFalse.setSoundEffectsEnabled(false);

				if(minecraftStyleForButtons)
				{
					ggShootButtonTrue = MinecraftButton(buttonsSize);
					ggShootButtonTrue.setText("Shoot");
				} else
				{
					ggShootButtonTrue = defaultColoredMinecraftButton("shoot", "#FFFFFFFF");
				}
				ggShootButtonTrue.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						shootGravityGun();
					}
				});
				ggShootButtonTrue.setSoundEffectsEnabled(false);

				layoutShoot.addView(ggShootButtonFalse);
				layoutShoot.addView(ggShootButtonTrue);
				ggShootButtonTrue.setVisibility(android.view.View.GONE);

				popupGravityGunShoot = new android.widget.PopupWindow(layoutShoot, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
				popupGravityGunShoot.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
				popupGravityGunShoot.showAtLocation(currentActivity.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.CENTER, 0, pixelsOffsetButtons);
				// SHOOT BUTTONS - END


				// DROP BUTTONS
				var layoutDrop = new android.widget.LinearLayout(currentActivity);
				layoutDrop.setOrientation(android.widget.LinearLayout.VERTICAL);

				if(minecraftStyleForButtons)
				{
					ggDropButtonFalse = MinecraftButton(buttonsSize);
					ggDropButtonFalse.setText("Drop");
				} else
				{
					ggDropButtonFalse = defaultColoredMinecraftButton("drop", "#FF929292");
				}
				ggDropButtonFalse.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						Sound.playFromFileName("gravitygun/fail.ogg");
						ModPE.showTipMessage("You are not picking any entity.");
					}
				});
				ggDropButtonFalse.setSoundEffectsEnabled(false);

				if(minecraftStyleForButtons)
				{
					ggDropButtonTrue = MinecraftButton(buttonsSize);
					ggDropButtonTrue.setText("Drop");
				} else
				{
					ggDropButtonTrue = defaultColoredMinecraftButton("drop", "#FFFFFFFF");
				}
				ggDropButtonTrue.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function(v)
					{
						dropGravityGun();
					}
				});
				ggDropButtonTrue.setSoundEffectsEnabled(false);

				layoutDrop.addView(ggDropButtonFalse);
				layoutDrop.addView(ggDropButtonTrue);
				ggDropButtonTrue.setVisibility(android.view.View.GONE);

				popupGravityGunDrop = new android.widget.PopupWindow(layoutDrop, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
				popupGravityGunDrop.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
				popupGravityGunDrop.showAtLocation(currentActivity.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.CENTER, 0, pixelsOffsetButtons);
				// DROP BUTTONS - END
			} catch(err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}

function shootGravityGun()
{
	isGravityGunPicking = false;

	Sound.playFromFileName("gravitygun/fire.ogg");

	if(ggIsBlock)
	{
		// TODO check if it is inside a block
		var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
		Entity.setVelX(ggEntity, dir.x * 1.5);
		Entity.setVelY(ggEntity, dir.y * 1.5);
		Entity.setVelZ(ggEntity, dir.z * 1.5);

		ggShotBlocksToBePlaced.push(new DroppedItemClass(ggEntity, ggBlockId, ggBlockData));
	} else
	{
		var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
		Entity.setVelX(ggEntity, dir.x * 3.3);
		Entity.setVelY(ggEntity, dir.y * 3.3);
		Entity.setVelZ(ggEntity, dir.z * 3.3);
	}

	ggEntity = null;
	updateEnabledGravityGunButtons();
}

function dropGravityGun()
{
	if(ggIsBlock)
	{
		var dir = getDirection(Entity.getYaw(Player.getEntity()), Entity.getPitch(Player.getEntity()));
		var x = Player.getX() + (dir.x * 2);
		var y = Player.getY() + (dir.y * 2.5);
		var z = Player.getZ() + (dir.z * 2);
		if(Level.getTile(Math.floor(x), Math.floor(y), Math.floor(z)) == 0)
		{
			isGravityGunPicking = false;
			Sound.playFromFileName("gravitygun/drop.ogg");
			updateEnabledGravityGunButtons();

			Level.setTileNotInAir(x, y, z, ggBlockId, ggBlockData);
			Entity.remove(ggEntity);
			ggEntity = null;
		} else
		{
			Sound.playFromFileName("gravitygun/fail.ogg");
			ModPE.showTipMessage("There is another block in this position.");
		}
	} else
	{
		isGravityGunPicking = false;
		Sound.playFromFileName("gravitygun/drop.ogg");
		updateEnabledGravityGunButtons();
		ggEntity = null;
	}
}

function updateEnabledGravityGunButtons()
{
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			if(isGravityGunPicking)
			{
				ggShootButtonFalse.setVisibility(android.view.View.GONE);
				ggShootButtonTrue.setVisibility(android.view.View.VISIBLE);

				ggDropButtonFalse.setVisibility(android.view.View.GONE);
				ggDropButtonTrue.setVisibility(android.view.View.VISIBLE);
			} else
			{
				ggShootButtonFalse.setVisibility(android.view.View.VISIBLE);
				ggShootButtonTrue.setVisibility(android.view.View.GONE);

				ggDropButtonFalse.setVisibility(android.view.View.VISIBLE);
				ggDropButtonTrue.setVisibility(android.view.View.GONE);
			}
		}
	}));
}

function pickBlockGravityGun(id, data)
{
	if(!isGravityGunPicking)
	{
		ggIsBlock = true;
		ggBlockId = id;
		ggBlockData = data;

		pickWithGravityGun();
	}
}

function pickEntityGravityGun(entity)
{
	if(!isGravityGunPicking)
	{
		ggIsBlock = false;
		ggEntity = entity;
		
		pickWithGravityGun();
	}
}

function pickWithGravityGun()
{
	if(!isGravityGunPicking)
	{		
		isGravityGunPicking = true;
		updateEnabledGravityGunButtons();
		if(Level.getGameMode() == GameMode.SURVIVAL)
			Player.damageCarriedItem();
		Sound.playFromFileName("gravitygun/pickup.ogg");
	}
}

function removeGravityGunUI()
{
	isGravityGunPicking = false;
	ggEntity = null;
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			try
			{
				popupGravityGunShoot.dismiss();
				popupGravityGunDrop.dismiss();
			} catch(err) { /* Gravity Gun not in hand */ }
		}
	}));
}
//########## GRAVITY GUN functions - END ##########


//########## LONG FALl BOOTS functions ##########
function makeLongFallBootsSound()
{
	var random = Math.floor((Math.random() * 2) + 1);
	Sound.playFromFileName("long_fall_boots/futureshoes" + random + ".wav");
}
//########## LONG FALl BOOTS functions - END ##########


//########## RADIO functions ##########
function startRadioMusic()
{
	try
	{
		radioPlayer.reset();
		radioPlayer.setDataSource(new android.os.Environment.getExternalStorageDirectory() + "/games/com.mojang/portal-sounds/music/looping_radio_mix.wav");
		radioPlayer.prepare();
		radioPlayer.setLooping(true);
		radioPlayer.setVolume(1.0, 1.0);
		radioPlayer.start();
	} catch(err)
	{
		ModPE.showTipMessage(getLogText() + "Sounds not installed!");
		ModPE.log(getLogText() + "Error in startRadioMusic: " + err);
		stopRadioMusic();
	}
}

function stopRadioMusic()
{
	isRadioPlaying = false;
	radioX = 0;
	radioY = 0;
	radioZ = 0;
	radioCountdown = 0;
	try
	{
		radioPlayer.reset();
	} catch(err) { }
}
//########## RADIO functions - END ##########


//########## JUKEBOX functions ##########
function JukeboxClass(x, y, z, disc)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.countdown = 0;
	this.disc = disc;

	this.player = new android.media.MediaPlayer();
	this.player.reset();
	this.player.setDataSource(sdcard + "/games/com.mojang/portal-sounds/" + getFileNameFromDiscId(disc));
	this.player.prepare();
	this.player.setVolume(1.0, 1.0);
	this.player.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener()
	{
		onCompletion: function()
		{
			var jukebox = getJukeboxObjectFromXYZ(x, y, z);
			if(jukebox != -1)
				jukebox.stopJukebox();
		}
	});
	this.player.start();

	nowPlayingMessage = "Now playing: " + Item.getName(disc, 0, false);
	currentActivity.runOnUiThread(new java.lang.Runnable(
	{
		run: function()
		{
			for(var ms = 0; ms < 17; ms++) // executed 17 times, 16 different colors, the last one to stop the effect
			{
				if(ms < 16)
				{
					new android.os.Handler().postDelayed(new java.lang.Runnable(
					{
						run: function()
						{
							ModPE.showTipMessage("§" + currentColor.toString(16) + nowPlayingMessage);
							if(currentColor == 15)
								currentColor = 0;
							else
								currentColor++;
						}
					}), ms * 250 + 1);
				} else
				{
					new android.os.Handler().postDelayed(new java.lang.Runnable(
					{
						run: function()
						{
							ModPE.showTipMessage(" ");
							currentColor = 0;
						}
					}), ms * 250 + 1);
				}
			}
		}
	}));


	this.stopJukebox = function()
	{
		this.ejectDisc();
		this.player.reset();
		jukeboxes.splice(jukeboxes.indexOf(this), 1);
	}

	this.ejectDisc = function()
	{
		Level.dropItem(this.x, this.y + 1, this.z, 0, this.disc, 1, 0);
	}
}

function getJukeboxObjectFromXYZ(x, y, z)
{
	for(var i in jukeboxes)
		if(Math.floor(jukeboxes[i].x) == Math.floor(x) && Math.floor(jukeboxes[i].y) == Math.floor(y) && Math.floor(jukeboxes[i].z) == Math.floor(z))
			return jukeboxes[i];
	return -1;
}

function getFileNameFromDiscId(discId)
{
	switch(discId)
	{
		case STILL_ALIVE_DISC_ID:
		{
			return "music/portal_still_alive.mp3";
		}
		case WANT_YOU_GONE_DISC_ID:
		{
			return "music/portal_want_you_gone.mp3";
		}
		case CARA_MIA_ADDIO_DISC_ID:
		{
			return "music/portal_turret_song.mp3";
		}
		default:
		{
			throw "Not A Disc";
		}
	}
}
//########## JUKEBOX functions - END ##########


//########## BLUE GEL functions ##########
function makeBounceSound()
{
	var random = Math.floor((Math.random() * 2) + 1);
	Sound.playFromFileName("gelblue/player_bounce_jump_paint_0" + random + ".wav");
}
//########## BLUE GEL functions - END ##########


//########## SOUND functions ##########
var sound1;
var sound2;
var sound3;

var Sound = {

	playFromFileName: function(fileName, x, y, z)
	{
		var volume = 1.0;

		// change volume based on distance from source
		if(!(x == null || y == null || z == null))
		{
			var distance = Math.sqrt( Math.pow(x - Player.getX(), 2) + Math.pow(y - Player.getY(), 2) + Math.pow(z - Player.getZ(), 2) );
			if(distance > MAX_LOGARITHMIC_VOLUME)
				volume = 0.0;
			else
			{
				volume = 1 - (Math.log(distance) / Math.log(MAX_LOGARITHMIC_VOLUME));
			}
		}

		// apply general volume
		volume = volume * generalVolume;

		// play sound
		try
		{
			if(sound1 == null)
			{
				if(DEBUG)
					clientMessage("sound 1");

				if(sound1 == null)
					sound1 = new android.media.MediaPlayer();
				sound1.reset();
				sound1.setDataSource(sdcard + "/games/com.mojang/portal-sounds/" + fileName);
				sound1.setVolume(volume, volume);
				sound1.prepare();
				sound1.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener()
				{
					onCompletion: function(mp)
					{
						if(DEBUG)
							clientMessage("sound 1 finish");
						sound1.release();
						sound1 = null;
					}
				});
				sound1.start();
				return 1; // END
			}
			if(sound2 == null)
			{
				if(DEBUG)
					clientMessage("sound 2");

				if(sound2 == null)
					sound2 = new android.media.MediaPlayer();
				sound2.reset();
				sound2.setDataSource(sdcard + "/games/com.mojang/portal-sounds/" + fileName);
				sound2.setVolume(volume, volume);
				sound2.prepare();
				sound2.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener()
				{
					onCompletion: function(mp)
					{
						if(DEBUG)
							clientMessage("sound 2 finish");
						sound2.release();
						sound2 = null;
					}
				});
				sound2.start();
				return 2; // END
			}
			if(sound3 == null)
			{
				if(DEBUG)
					clientMessage("sound 3");

				if(sound3 == null)
					sound3 = new android.media.MediaPlayer();
				sound3.reset();
				sound3.setDataSource(sdcard + "/games/com.mojang/portal-sounds/" + fileName);
				sound3.setVolume(volume, volume);
				sound3.prepare();
				sound3.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener()
				{
					onCompletion: function(mp)
					{
						if(DEBUG)
							clientMessage("sound 3 finish");
						sound3.release();
						sound3 = null;
					}
				});
				sound3.start();
				return 3; // END
			} else
			{
				if(DEBUG)
					clientMessage("sound 1 all");

				if(sound1 == null)
					sound1 = new android.media.MediaPlayer();
				sound1.reset();
				sound1.setDataSource(sdcard + "/games/com.mojang/portal-sounds/" + fileName);
				sound1.setVolume(volume, volume);
				sound1.prepare();
				sound1.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener()
				{
					onCompletion: function(mp)
					{
						if(DEBUG)
							clientMessage("sound 1 all finish");
						sound1.release();
						sound1 = null;
					}
				});
				sound1.start();
				return 1; // END
			}
		} catch(err)
		{
			ModPE.showTipMessage(getLogText() + "Sounds not installed!");
			ModPE.log(getLogText() + "Error in playSoundFromFile: " + err);
		}
	}
};
//########## SOUND functions - END ##########


//########## PLAYER functions ##########
Player.damageCarriedItem = function()
{
	var maxDamage;
	if(Player.getCarriedItem() == GRAVITY_GUN_ID)
		maxDamage = GRAVITY_GUN_MAX_DAMAGE;
	if(Player.getCarriedItem() == PORTAL_GUN_ORANGE_ID || Player.getCarriedItem() == PORTAL_GUN_BLUE_ID)
		maxDamage = PORTAL_GUN_DAMAGE;
	if(Player.getCarriedItem() == PORTAL_GUN_GOLD_ID)
		maxDamage = PORTAL_GUN_GOLD_DAMAGE;
	if(Player.getCarriedItem() == PORTAL_GUN_IRON_ID)
		maxDamage = PORTAL_GUN_IRON_DAMAGE;
	if(Player.getCarriedItem() == PORTAL_GUN_LAVA_ID)
		maxDamage = PORTAL_GUN_LAVA_DAMAGE;
	if(Player.getCarriedItem() == PORTAL_GUN_WOOD_AND_STONE_ID)
		maxDamage = PORTAL_GUN_WOOD_AND_STONE_DAMAGE;

	if(Player.getCarriedItemData() < maxDamage)
		Entity.setCarriedItem(Player.getEntity(), Player.getCarriedItem(), Player.getCarriedItemCount(), Player.getCarriedItemData() + 1);
	else
	{
		Level.playSoundEnt(Player.getEntity(), "random.break", 100, 30);
		if(Player.getCarriedItemCount() == 1)
			Player.clearInventorySlot(Player.getSelectedSlotId());
		else
			Entity.setCarriedItem(Player.getEntity(), Player.getCarriedItem(), Player.getCarriedItemCount() - 1, 0);
	}
}

Player.decreaseByOneCarriedItem = function()
{
	if(Player.getCarriedItemCount() == 1)
		Player.clearInventorySlot(Player.getSelectedSlotId());
	else
		Entity.setCarriedItem(Player.getEntity(), Player.getCarriedItem(), Player.getCarriedItemCount() - 1, 0);
}
//########## PLAYER functions - END ##########


//########## LEVEL functions ##########
Level.setTileNotInAir = function(x, y, z, id, data)
{
	x = Math.floor(x);
	y = Math.floor(y);
	z = Math.floor(z);

	notInAir:
	for(var i = y; i > 0; i--)
	{
		if(Level.getTile(x, i - 1, z) > 0)
		{
			y = i;
			break notInAir;
		}
	}

	Level.setTile(x, y, z, id, data);
}

Level.placeBlockFromItem = function(x, y, z, side, blockId, canBePlacedOnAir)
{
	if(canBePlacedOnAir == null)
		canBePlacedOnAir = false; // must be placed on a block

	var canBePlaced = true;

	switch(side)
	{
		case 0: // down
		{
			y--;
			if(canBePlacedOnAir || Level.getTile(x, y - 1, z) == 0)
				canBePlaced = false;
			break;
		}
		case 1: // up
		{
			y++;
			break;
		}
		case 2:
		{
			z--;
			if(canBePlacedOnAir || Level.getTile(x, y - 1, z) == 0)
				canBePlaced = false;
			break;
		}
		case 3:
		{
			z++;
			if(canBePlacedOnAir || Level.getTile(x, y - 1, z) == 0)
				canBePlaced = false;
			break;
		}
		case 4:
		{
			x--;
			if(canBePlacedOnAir || Level.getTile(x, y - 1, z) == 0)
				canBePlaced = false;
			break;
		}
		case 5:
		{
			x++;
			if(canBePlacedOnAir || Level.getTile(x, y - 1, z) == 0)
				canBePlaced = false;
			break;
		}
	}
	if(canBePlaced)
		Level.setTile(x, y, z, blockId);
}
//########## LEVEL functions - END ##########


//########## INTERNET functions ##########
function updateLatestVersionMod()
{
	try
	{
		// download content
		var url = new java.net.URL("https://raw.githubusercontent.com/Desno365/MCPE-scripts/master/portalMOD-version");
		var connection = url.openConnection();
 
		// get content
		inputStream = connection.getInputStream();
 
		// read result
		var loadedVersion = "";
		var bufferedVersionReader = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
		var rowVersion = "";
		while((rowVersion = bufferedVersionReader.readLine()) != null)
		{
			loadedVersion += rowVersion;
		}
		latestVersion = loadedVersion.split(" ")[0];
 
		// close what needs to be closed
		bufferedVersionReader.close();
		inputStream.close();
	} catch(err)
	{
		clientMessage("Portal Mod: Can't check for updates, please check your Internet connection.");
		ModPE.log(getLogText() + "updateLatestVersionMod(): caught an error: " + err);
	}
}
//########## INTERNET functions - END ##########


//########## DIRECTION functions ##########
function vector3d(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

function getDirection(yaw, pitch)
{
	var direction = new vector3d(0, 0, 0);
	direction.y = -Math.sin(java.lang.Math.toRadians(pitch));
	direction.x = -Math.sin(java.lang.Math.toRadians(yaw)) * Math.cos(java.lang.Math.toRadians(pitch));
	direction.z = Math.cos(java.lang.Math.toRadians(yaw)) * Math.cos(java.lang.Math.toRadians(pitch));
	return direction;
}
//########## DIRECTION functions - END ##########


//########## IMAGE functions ##########
function createImages()
{
	var bluePortalDecoded = decodeImageFromBase64(bluePortalImage);
	bluePortalScaled = scaleImageToDensity(bluePortalDecoded);
	bluePortalImage = null;

	var orangePortalDecoded = decodeImageFromBase64(orangePortalImage);
	orangePortalScaled = scaleImageToDensity(orangePortalDecoded);
	orangePortalImage = null;

	var overlayDecoded = decodeImageFromBase64(overlayFull);
	overlayFullScaled = scaleImageToDensity(overlayDecoded);
	overlayFull = null;

	var overlayBlueDecoded = decodeImageFromBase64(overlayBlue);
	overlayBlueScaled = scaleImageToDensity(overlayBlueDecoded);
	overlayBlue = null;

	var overlayOrangeDecoded = decodeImageFromBase64(overlayOrange);
	overlayOrangeScaled = scaleImageToDensity(overlayOrangeDecoded);
	overlayOrange = null;

	var overlayBlankDecoded = decodeImageFromBase64(overlayBlank);
	overlayBlankScaled = scaleImageToDensity(overlayBlankDecoded);
	overlayBlank = null;

	var dividerDecoded = decodeImageFromBase64(divider);
	dividerScaled = scaleImageToDensity(dividerDecoded);
	divider = null;
}

function decodeImageFromBase64(base64String)
{
	if(base64String != null)
	{
		var byteArray = android.util.Base64.decode(base64String, 0);
		return android.graphics.BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);
	}else
	{
		throw getLogText() + "decodeImageFromBase64 has found a null string.";
	}
}

function scaleImageToDensity(image)
{
	//
	return scaleImageToSize(image, Math.round(image.getWidth() * deviceDensity), Math.round(image.getHeight() * deviceDensity));
}

function scaleImageToSize(image, width, height, filter)
{
	if(filter == null)
		filter = false;
	return android.graphics.Bitmap.createScaledBitmap(image, Math.round(width), Math.round(height), filter);
}
//########## IMAGE functions - END ##########


//########## UTILS OF UIs functions ##########
function convertDpToPixel(dp)
{
	//
	return Math.round(dp * deviceDensity);
}

function basicMinecraftTextView(text, textSize) // TextView with just the Minecraft font
{
	var lineSpacing = convertDpToPixel(4);

	var textview = new android.widget.TextView(currentActivity);
	textview.setText(new android.text.Html.fromHtml(text));
	if(textSize != null)
		textview.setTextSize(textSize);
	textview.setTypeface(MinecraftButtonLibrary.ProcessedResources.font);
	textview.setPaintFlags(textview.getPaintFlags() | android.graphics.Paint.SUBPIXEL_TEXT_FLAG);
	textview.setLineSpacing(lineSpacing, 1);
	if(android.os.Build.VERSION.SDK_INT > 19) // KITKAT
		textview.setShadowLayer(1, Math.round((textview.getLineHeight() - lineSpacing) / 8), Math.round((textview.getLineHeight() - lineSpacing) / 8), android.graphics.Color.parseColor("#FF333333"));
	else
		textview.setShadowLayer(0.001, Math.round((textview.getLineHeight() - lineSpacing) / 8), Math.round((textview.getLineHeight() - lineSpacing) / 8), android.graphics.Color.parseColor("#FF333333"));

	return textview;
}

function defaultColoredMinecraftButton(text, colorString)
{
	var padding = convertDpToPixel(4);

	var bg = android.graphics.drawable.GradientDrawable();
	bg.setColor(android.graphics.Color.TRANSPARENT);
	bg.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
	bg.setStroke(convertDpToPixel(1), android.graphics.Color.parseColor(colorString));

	var coloredButton = basicMinecraftTextView(text, buttonsSize);
	coloredButton.setGravity(android.view.Gravity.CENTER);
	coloredButton.setTextColor(android.graphics.Color.parseColor(colorString));
	coloredButton.setBackgroundDrawable(bg);
	coloredButton.setPadding(padding, padding, padding, padding);
	coloredButton.setLayoutParams(new android.view.ViewGroup.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT));

	return coloredButton;
}
//########## UTILS OF UIs functions - END ##########


//########## MISC functions ##########
function getLogText()
{
	//
	return("Portal Mod: ");
}

function normalizeAngle(angle)
{
	var newAngle = angle;
	while (newAngle < 0) newAngle += 360;
	while (newAngle > 360) newAngle -= 360;
	return newAngle;
}

function DroppedItemClass(entity, id, data)
{
	this.entity = entity;
	this.id = id;
	this.data = data;
	this.previousX = 0;
	this.previousY = 0;
	this.previousZ = 0;
}

function EntityClass(entity)
{
	this.entity = entity;
	this.previousX = 0;
	this.previousY = 0;
	this.previousZ = 0;
}

function PortalClass(x1, y1, z1, x2, y2, z2, type)
{
	this.x1 = Math.floor(x1);
	this.y1 = Math.floor(y1);
	this.z1 = Math.floor(z1);
	this.x2 = Math.floor(x2);
	this.y2 = Math.floor(y2);
	this.z2 = Math.floor(z2);
	this.type = type;
}
//########## MISC functions - END ##########


//########################################################################################################################################################
// Utils of popup's UI functions
//########################################################################################################################################################

const MARGIN_HORIZONTAL_BIG = 16;
const MARGIN_HORIZONTAL_SMALL = 4;

function setMarginsLinearLayout(view, left, top, right, bottom)
{
	var originalParams = view.getLayoutParams();
	var newParams = new android.widget.LinearLayout.LayoutParams(originalParams);
	newParams.setMargins(convertDpToPixel(left), convertDpToPixel(top), convertDpToPixel(right), convertDpToPixel(bottom));
	view.setLayoutParams(newParams);
}

function dividerText()
{
	var dividerText = new android.widget.TextView(currentActivity);
	dividerText.setText(" ");
	return dividerText;
}

function defaultContentTextView(text) // TextView for contents (basicMinecraftTextView with little changes)
{
	var textview = basicMinecraftTextView(text, 12);
	textview.setTextColor(android.graphics.Color.parseColor(MinecraftButtonLibrary.defaultButtonTextColor));

	return textview;
}

function defaultSubTitle(subtitle) // TextView with Minecraft background
{
	var padding = convertDpToPixel(8);

	var bg = android.graphics.drawable.GradientDrawable();
	bg.setColor(android.graphics.Color.parseColor("#FF736A6F"));
	bg.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
	bg.setStroke(convertDpToPixel(2), android.graphics.Color.parseColor("#FF93898B"));

	var title = basicMinecraftTextView(subtitle, 16);
	title.setTextColor(android.graphics.Color.WHITE);
	title.setBackgroundDrawable(bg);
	title.setPadding(padding, padding, padding, padding);

	return title;
}

function defaultLayout(title)
{
	var layout = new android.widget.LinearLayout(currentActivity);
	layout.setOrientation(android.widget.LinearLayout.VERTICAL);
	var padding = convertDpToPixel(8);
	layout.setPadding(padding, padding, padding, padding);
	layout.setBackgroundDrawable(background);

	var titleTextView = basicMinecraftTextView(title, 18);
	titleTextView.setTextColor(android.graphics.Color.WHITE);
	titleTextView.setGravity(android.view.Gravity.CENTER);
	layout.addView(titleTextView);
	setMarginsLinearLayout(titleTextView, 0, 4, 0, 4);

	var divider = new android.view.View(currentActivity);
	divider.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.parseColor("#958681")));
	divider.setLayoutParams(new android.view.ViewGroup.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, convertDpToPixel(1)));
	layout.addView(divider);
	setMarginsLinearLayout(divider, 0, 8, 0, 8);

	return layout;
}

function defaultPopup(layout)
{
	var scroll = new android.widget.ScrollView(currentActivity);
	scroll.addView(layout);

	var popup = new android.app.Dialog(currentActivity);
	popup.requestWindowFeature(android.view.Window.FEATURE_NO_TITLE);
	popup.setContentView(scroll);
	return popup;
}


//########################################################################################################################################################
// Popup's UI functions
//########################################################################################################################################################

function updateAvailableUI()
{
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				var layout;
				layout = defaultLayout("Portal Mod: new version");

				var updatesText = defaultContentTextView("New version available, you have the " + CURRENT_VERSION + " version and the latest version is " + latestVersion + ".<br>" +
					"You can find a download link on Desno365's website (press the button to visit it).");
				layout.addView(updatesText);
				setMarginsLinearLayout(updatesText, 0, MARGIN_HORIZONTAL_SMALL, 0, MARGIN_HORIZONTAL_SMALL);

				var threadButton = MinecraftButton();
				threadButton.setText("Visit website");
				threadButton.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function()
					{
						var intentBrowser = new android.content.Intent(currentActivity);
						intentBrowser.setAction(android.content.Intent.ACTION_VIEW);
						intentBrowser.setData(android.net.Uri.parse("http://desno365.github.io/minecraft/portal2-mod/"));
						currentActivity.startActivity(intentBrowser);
						popup.dismiss();
					}
				});
				layout.addView(threadButton);
				setMarginsLinearLayout(threadButton, 0, MARGIN_HORIZONTAL_SMALL, 0, MARGIN_HORIZONTAL_BIG);

				var exitButton = MinecraftButton();
				exitButton.setText("Close");
				exitButton.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function()
					{
						popup.dismiss();
					}
				});
				layout.addView(exitButton);
				setMarginsLinearLayout(exitButton, 0, MARGIN_HORIZONTAL_SMALL, 0, MARGIN_HORIZONTAL_SMALL);


				var popup = defaultPopup(layout);
				popup.setCanceledOnTouchOutside(false);
				popup.show();

			} catch(err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}

// No Minecraft Layout because this UI can be showed at startup
function pleaseInstallTextureUI()
{
	textureUiShowed = true;
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				var layout = new android.widget.LinearLayout(currentActivity);
				var padding = convertDpToPixel(8);
				layout.setPadding(padding, padding, padding, padding);
				layout.setOrientation(android.widget.LinearLayout.VERTICAL);

				var scroll = new android.widget.ScrollView(currentActivity);
				scroll.addView(layout);

				var popup = new android.app.Dialog(currentActivity);
				popup.setContentView(scroll);
				popup.setTitle(new android.text.Html.fromHtml("Texture not installed"));
				popup.setCanceledOnTouchOutside(false);

				var text = new android.widget.TextView(currentActivity);
				text.setText(new android.text.Html.fromHtml("Seems that you haven't installed the Portal 2 Mod texture pack.<br><br>Please install the Texture Pack of the mod and <b>restart BlockLauncher</b> to enjoy all the features of the Portal 2 Mod."));
				layout.addView(text);

				layout.addView(dividerText());

				var exitButton = new android.widget.Button(currentActivity);
				exitButton.setText("OK");
				exitButton.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function()
					{
						textureUiShowed = false;
						popup.dismiss();
					}
				});
				layout.addView(exitButton);


				popup.show();

			} catch(err)
			{
				print("Error: " + err);
			}
		}
	});
}


//########################################################################################################################################################
// Things to do at startup
//########################################################################################################################################################

// create images from base64
new java.lang.Thread(new java.lang.Runnable()
{
	run: function()
	{
		try
		{
			createImages();
		} catch(e)
		{
			print("Error " + e);
		}
	}
}).start();


//########################################################################################################################################################
// MINECRAFT BUTTON LIBRARY
//########################################################################################################################################################

// Library version: 1.2.2
// Made by Dennis Motta, also known as Desno365
// https://github.com/Desno365/Minecraft-Button-Library

/*
	The MIT License (MIT)

	Copyright (c) 2015 Dennis Motta 

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

var MinecraftButtonLibrary = {};

// Customization
// These are the default values of the library, you can change them to make the buttons look how you want to.
MinecraftButtonLibrary.defaultButtonPadding = 8;
MinecraftButtonLibrary.defaultButtonTextSize = 16;
MinecraftButtonLibrary.defaultButtonTextLineSpacing = 4;
MinecraftButtonLibrary.defaultButtonTextColor = "#FFDDDDDD";
MinecraftButtonLibrary.defaultButtonTextPressedColor = "#FFFBFF97";
MinecraftButtonLibrary.defaultButtonTextShadowColor = "#FF292929";

// Variables
MinecraftButtonLibrary.Resources = {};
MinecraftButtonLibrary.ProcessedResources = {};

MinecraftButtonLibrary.context = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
MinecraftButtonLibrary.metrics = new android.util.DisplayMetrics();
MinecraftButtonLibrary.context.getWindowManager().getDefaultDisplay().getMetrics(MinecraftButtonLibrary.metrics);
MinecraftButtonLibrary.sdcard = new android.os.Environment.getExternalStorageDirectory();
MinecraftButtonLibrary.LOG_TAG = "Minecraft Button Library ";

MinecraftButtonLibrary.ProcessedResources.font = null;
MinecraftButtonLibrary.ProcessedResources.mcNormalNineDrawable = null;
MinecraftButtonLibrary.ProcessedResources.mcPressedNineDrawable = null;

//########################################################################################################################################################
// LIBRARY
//########################################################################################################################################################

function MinecraftButton(textSize, enableSound)
{
	if(textSize == null)
		textSize = MinecraftButtonLibrary.defaultButtonTextSize;
	if(enableSound == null)
		enableSound = true;

	var button = new android.widget.Button(MinecraftButtonLibrary.context);
	button.setTextSize(textSize);
	button.setOnTouchListener(new android.view.View.OnTouchListener()
	{
		onTouch: function(v, motionEvent)
		{
			MinecraftButtonLibrary.onTouch(v, motionEvent, enableSound);
			return false;
		}
	});
	if (android.os.Build.VERSION.SDK_INT >= 14)
		button.setAllCaps(false);
	MinecraftButtonLibrary.setButtonBackground(button, MinecraftButtonLibrary.ProcessedResources.mcNormalNineDrawable);
	button.setTag(false); // is pressed?
	button.setSoundEffectsEnabled(false);
	button.setGravity(android.view.Gravity.CENTER);
	button.setTextColor(android.graphics.Color.parseColor(MinecraftButtonLibrary.defaultButtonTextColor));
	button.setPadding(MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding));
	button.setLineSpacing(MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonTextLineSpacing), 1);
	// apply custom font with shadow
	button.setTypeface(MinecraftButtonLibrary.ProcessedResources.font);
	button.setPaintFlags(button.getPaintFlags() | android.graphics.Paint.SUBPIXEL_TEXT_FLAG);
	if (android.os.Build.VERSION.SDK_INT >= 19) // KitKat
		button.setShadowLayer(1, Math.round((button.getLineHeight() - MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonTextLineSpacing)) / 8), Math.round((button.getLineHeight() - MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonTextLineSpacing)) / 8), android.graphics.Color.parseColor(MinecraftButtonLibrary.defaultButtonTextShadowColor));
	else
		button.setShadowLayer(0.0001, Math.round((button.getLineHeight() - MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonTextLineSpacing)) / 8), Math.round((button.getLineHeight() - MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonTextLineSpacing)) / 8), android.graphics.Color.parseColor(MinecraftButtonLibrary.defaultButtonTextShadowColor));

	return button;
}

// ######### BUTTON UTILS functions #########
MinecraftButtonLibrary.setButtonBackground = function(button, background)
{
	if (android.os.Build.VERSION.SDK_INT >= 16)
		button.setBackground(background);
	else
		button.setBackgroundDrawable(background);
}

MinecraftButtonLibrary.convertDpToPixel = function(dp)
{
	var density = MinecraftButtonLibrary.metrics.density;

	return (dp * density);
}

MinecraftButtonLibrary.onTouch = function(v, motionEvent, enableSound)
{
	var action = motionEvent.getActionMasked();
	if(action == android.view.MotionEvent.ACTION_DOWN)
	{
		// button pressed
		MinecraftButtonLibrary.changeToPressedState(v);
	}
	if(action == android.view.MotionEvent.ACTION_CANCEL || action == android.view.MotionEvent.ACTION_UP)
	{
		// button released
		MinecraftButtonLibrary.changeToNormalState(v);
		
		var rect = new android.graphics.Rect(v.getLeft(), v.getTop(), v.getRight(), v.getBottom());
		if(rect.contains(v.getLeft() + motionEvent.getX(), v.getTop() + motionEvent.getY())) // detect if the event happens inside the view
		{
			// onClick will run soon

			// play sound
			if(enableSound)
				Level.playSoundEnt(Player.getEntity(), "random.click", 100, 30);
		}
	}
	if(action == android.view.MotionEvent.ACTION_MOVE)
	{
		var rect = new android.graphics.Rect(v.getLeft(), v.getTop(), v.getRight(), v.getBottom());
		if(rect.contains(v.getLeft() + motionEvent.getX(), v.getTop() + motionEvent.getY())) // detect if the event happens inside the view
		{
			// pointer inside the view
			if(v.getTag() == false)
			{
				// restore pressed state
				v.setTag(true); // is pressed?

				MinecraftButtonLibrary.changeToPressedState(v);
			}
		} else
		{
			// pointer outside the view
			if(v.getTag() == true)
			{
				// restore pressed state
				v.setTag(false); // is pressed?

				MinecraftButtonLibrary.changeToNormalState(v);
			}
		}
	}
}

MinecraftButtonLibrary.changeToNormalState = function(button)
{
	MinecraftButtonLibrary.setButtonBackground(button, MinecraftButtonLibrary.ProcessedResources.mcNormalNineDrawable);
	button.setTextColor(android.graphics.Color.parseColor(MinecraftButtonLibrary.defaultButtonTextColor));
	// reset pressed padding
	button.setPadding(MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding));
}

MinecraftButtonLibrary.changeToPressedState = function(button)
{
	MinecraftButtonLibrary.setButtonBackground(button, MinecraftButtonLibrary.ProcessedResources.mcPressedNineDrawable);
	button.setTextColor(android.graphics.Color.parseColor(MinecraftButtonLibrary.defaultButtonTextPressedColor));
	// make the effect of a pressed button with padding
	button.setPadding(MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding) + MinecraftButtonLibrary.convertDpToPixel(2), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding), MinecraftButtonLibrary.convertDpToPixel(MinecraftButtonLibrary.defaultButtonPadding) - MinecraftButtonLibrary.convertDpToPixel(2));
}
// ######### END - BUTTON UTILS functions #########


// ######### CREATE NINE PATCH functions #########
MinecraftButtonLibrary.createNinePatchDrawables = function()
{
	var mcButtonNormalBitmap = MinecraftButtonLibrary.getMinecraftButtonBitmap();
	var mcButtonPressedBitmap = MinecraftButtonLibrary.getMinecraftButtonPressedBitmap();

	var mcNormalNinePatch = new android.graphics.NinePatch(mcButtonNormalBitmap, mcButtonNormalBitmap.getNinePatchChunk(), null);
	var mcPressedNinePatch = new android.graphics.NinePatch(mcButtonPressedBitmap, mcButtonPressedBitmap.getNinePatchChunk(), null);

	// here is used a deprecated method that doesn't deals with density
	//noinspection deprecation
	MinecraftButtonLibrary.ProcessedResources.mcNormalNineDrawable = new android.graphics.drawable.NinePatchDrawable(mcNormalNinePatch);
	MinecraftButtonLibrary.ProcessedResources.mcNormalNineDrawable.setFilterBitmap(false);
	//noinspection deprecation
	MinecraftButtonLibrary.ProcessedResources.mcPressedNineDrawable = new android.graphics.drawable.NinePatchDrawable(mcPressedNinePatch);
	MinecraftButtonLibrary.ProcessedResources.mcPressedNineDrawable.setFilterBitmap(false);
}

MinecraftButtonLibrary.getMinecraftButtonBitmap = function()
{
	var density = MinecraftButtonLibrary.metrics.density;

	if(density < 1)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", ldpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStateNormalLDPI);
	}
	if(density >= 1 && density < 1.5)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", mdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStateNormalMDPI);
	}
	if(density >= 1.5 && density < 2)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", hdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStateNormalHDPI);
	}
	if(density >= 2 && density < 2.5)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", xhdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXHDPI);
	}
	if(density >= 2.5)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", xxhdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXXHDPI);
	}

	ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Error: " + density + ", xhdpi");
	return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXHDPI);
}

MinecraftButtonLibrary.getMinecraftButtonPressedBitmap = function()
{
	var density = MinecraftButtonLibrary.metrics.density;

	if(density < 1)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", ldpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStatePressedLDPI);
	}
	if(density >= 1 && density < 1.5)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", mdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStatePressedMDPI);
	}
	if(density >= 1.5 && density < 2)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", hdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStatePressedHDPI);
	}
	if(density >= 2 && density < 2.5)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", xhdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXHDPI);
	}
	if(density >= 2.5)
	{
		ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Density: " + density + ", xxhdpi");
		return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXXHDPI);
	}

	ModPE.log(MinecraftButtonLibrary.LOG_TAG + "Error: " + density + ", xhdpi");
	return MinecraftButtonLibrary.decodeImageFromBase64(MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXHDPI);
}

MinecraftButtonLibrary.decodeImageFromBase64 = function(base64String)
{
	var byteArray = android.util.Base64.decode(base64String, 0);
	return android.graphics.BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);
}
// ######### END - CREATE NINE PATCH functions #########


// ######### CREATE TYPEFACE functions #########
MinecraftButtonLibrary.createTypeface = function()
{
	MinecraftButtonLibrary.writeFileFromByteArray(android.util.Base64.decode(MinecraftButtonLibrary.Resources.base64Font, 0), MinecraftButtonLibrary.sdcard + "/minecraft.ttf");
	MinecraftButtonLibrary.ProcessedResources.font = android.graphics.Typeface.createFromFile(MinecraftButtonLibrary.sdcard + "/minecraft.ttf");
	MinecraftButtonLibrary.deleteFile(MinecraftButtonLibrary.sdcard + "/minecraft.ttf");
}

MinecraftButtonLibrary.writeFileFromByteArray = function(byteArray, path)
{
	var file = new java.io.File(path);
	if(file.exists())
		file.delete();
	file.createNewFile();
	var stream = new java.io.FileOutputStream(file);
	stream.write(byteArray);
	stream.close();
	byteArray = null;
}
// ######### END - CREATE TYPEFACE functions #########


// ######### UTILS functions #########
MinecraftButtonLibrary.removeResources = function()
{
	MinecraftButtonLibrary.Resources.minecraftButtonStateNormalLDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStateNormalMDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStateNormalHDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXHDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXXHDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStatePressedLDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStatePressedMDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStatePressedHDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXHDPI = null;
	MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXXHDPI = null;

	MinecraftButtonLibrary.Resources.base64Font = null;
}

MinecraftButtonLibrary.deleteFile = function(path)
{
	var file = new java.io.File(path);

	if(file.isDirectory())
	{
		var directoryFiles = file.listFiles();
		for(var i in directoryFiles)
		{
			deleteFile(directoryFiles[i].getAbsolutePath());
		}
		file.delete();
	}

	if(file.isFile())
		file.delete();
}
// ######### END - UTILS functions #########


//########################################################################################################################################################
// RESOURCES IN BASE64
//########################################################################################################################################################

// backgrounds
MinecraftButtonLibrary.Resources.minecraftButtonStateNormalLDPI = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAACAAAAAgAAAAMAAAACMAAAAAAAAAEAAAAHAAAAAgAAAAf/vLGr/7yxqwAAAAH/vLGr/5WGgQAAAAH/cmVnAAAAAf8oJyoMgs1WAAAASUlEQVQY02Pcs3H1fwY8gAmf5NYtexhYGBgYGG5evYZVwfZDh/GbwPD/PwEFjIwEFBByJAPDfwaWbVv2MGw7eIiBgRFuLrIdDADq5BFxvezsVAAAAABJRU5ErkJggg==";
MinecraftButtonLibrary.Resources.minecraftButtonStateNormalMDPI = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAEAAAABAAAAAYAAAAEMAAAAAAAAAIAAAAOAAAABAAAAA7/vLGr/7yxqwAAAAH/vLGr/5WGgQAAAAH/cmVnAAAAAf8oJyqdu2NqAAAAT0lEQVQ4y2Pcs3H1fwYKABMDhYCFXI1bt+yhsgtuXr1Gksbthw4PcBgw/P8/0C5gZKSOCwbeAPLDgIFasbANmqa3HTwEDV2M4MYVDdRxAQBscxGJWBLxyQAAAABJRU5ErkJggg==";
MinecraftButtonLibrary.Resources.minecraftButtonStateNormalHDPI = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAGAAAABgAAAAkAAAAGMAAAAAAAAAMAAAAVAAAABgAAABX/vLGr/7yxqwAAAAH/vLGr/5WGgQAAAAH/cmVnAAAAAf8oJyqPt1DfAAAAV0lEQVRIx2Pcs3H1fwYaAiYGGgOaW8BCC0O3btkzXIPo5tVrVDF0+6HDo6mIAPj/fzSICABGxmEURKMWDFAqYhhWGW0bUu2z7eAhpMyCMxcRk9OGURABAH/ZEZn4HdB3AAAAAElFTkSuQmCC";
MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXHDPI = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAIAAAACAAAAAwAAAAIMAAAAAAAAAQAAAAcAAAACAAAABz/vLGr/7yxqwAAAAH/vLGr/5WGgQAAAAH/cmVnAAAAAf8oJypkuTlTAAAAZUlEQVRYw2Pcs3H1f4YBBEwMAwxGHcBCbwu3btkzGgWDPA3cvHqNphZuP3R4NApGeDnA8P//aBSM9DTAyDgaBaMOGHXASC8HGEbrgsGWBrahtdO3HTyEVnYTLNxJrQxGo2BwOQAAWckRqcYME3kAAAAASUVORK5CYII=";
MinecraftButtonLibrary.Resources.minecraftButtonStateNormalXXHDPI = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAMAAAADAAAABIAAAAMMAAAAAAAAAYAAAAqAAAADAAAACr/vLGr/7yxqwAAAAH/vLGr/5WGgQAAAAH/cmVnAAAAAf8oJypAoV45AAAAg0lEQVRo3u3ZwQmAMAyF4UTcfxFPgtZLL9YZFJwmTtCDINQ0/5sgHzxCQzXPk4njDOI8AABEB4xeBl2XTIUAAAi1he7z+tWgWzmoEAAAvIVaxowKAQDAFmoZVSoEAAAAAAAAAIj7FhIuMgAA+txCqfL3lPZSuYxen1JfnWRUCACAHgEPIUcRyZ0dVsEAAAAASUVORK5CYII=";
MinecraftButtonLibrary.Resources.minecraftButtonStatePressedLDPI = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAACAAAAAgAAAAIAAAADMAAAAAAAAAEAAAAHAAAAAQAAAAb/KCcqAAAAAf9yZWcAAAABAAAAAQAAAAEAAAABAAAAAQAAAAGZYAV4AAAAb0lEQVQY012OQQqDMBRE34Scwp1QsHgHs7CbGnv9UjzNuIjRxuHD/wzzhq/nMBrKIIENAhA5TUQwS0pUiZIFeK8zEVSAQy5Vpxdq3k3HdYbLq2xTRwBht2T9QxJxSRP588I2d9kmPvqO7ftryb+9AxX7IG5YZYu3AAAAAElFTkSuQmCC";
MinecraftButtonLibrary.Resources.minecraftButtonStatePressedMDPI = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAEAAAABAAAAAQAAAAGMAAAAAAAAAIAAAAOAAAAAgAAAAz/KCcqAAAAAf9yZWcAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEDO+tuAAAAkklEQVQ4y62SwQrCMAyGvwyfwpswcOwd7EEvbu71Zfg08ZIgi10ZtLm0CSn5/r+R4ToqAGwPRCy3gqV+mdMNgI7KOPnIKaVsgw/WUH++7s0IZCsxhP5Myfa184CgVf5cyJvTgiDarUYixV/wQrtfUC1rjiRim1pPMNlOz8vDSPTQQ++rJ+gvZwA+77WseSevJvgCGagihHTV1j0AAAAASUVORK5CYII=";
MinecraftButtonLibrary.Resources.minecraftButtonStatePressedHDPI = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAGAAAABgAAAAYAAAAJMAAAAAAAAAMAAAAVAAAAAwAAABL/KCcqAAAAAf9yZWcAAAABAAAAAQAAAAEAAAABAAAAAQAAAAGqizz1AAAAl0lEQVRIx92VwQqAIAyGXfQU3YKg6B3yUJe0Xj+ip1k3+QOHGXhoO+l0Ch/flIZ+ZBMiPjREkIcFSOPE2ymMK1M4il9QIwtnbbIAqbCwZ91mXYgoLoUQ/NQrWavMIiMYQqJHadVUIJK6iAEXZTUaLihrNOY8WyRcBM+7AkQOfh+/L4CLPx+KtQoQdW0TJtdx5tnyIv9/RDcytSKUL7bTXAAAAABJRU5ErkJggg==";
MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXHDPI = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAAIAAAACAAAAAgAAAAMMAAAAAAAAAQAAAAcAAAABAAAABj/KCcqAAAAAf9yZWcAAAABAAAAAQAAAAEAAAABAAAAAQAAAAHs/TEDAAAAqUlEQVRYw+2WwQqAIAyGXfQU3YKg6B3yUJe0Xj+ip1ln/8AhBnrYbroxhe/frzSNM5sg4ktDBHkogDRueLsE68YUDr1Ai5CdtUkNEDkL9fuxKoLqNEDxMRaCv0aR1E8R1OcDRphrEp0gzTgUQQ0akMydQROU9RZggSKo7y1gzptzSRMEf0pFUF4DDv7p/txAE/zrgdhPEZTXwNB3wcZz3XlznphXBMUv8AJ9bSKkEsE9twAAAABJRU5ErkJggg==";
MinecraftButtonLibrary.Resources.minecraftButtonStatePressedXXHDPI = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGG5wT2wAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADYHRhkAAAAVG5wVGMAAgIJIAAAACgAAAAAAAALAAAACwAAAAsAAAARMAAAAAAAAAYAAAAqAAAABgAAACT/KCcqAAAAAf9yZWcAAAABAAAAAQAAAAEAAAABAAAAAQAAAAGV/cSjAAAAzElEQVRo3u2ZQQrCMBBFM9JTuBMEi3cwC93Y6vVFPM14gfzFQIpMfLNMJk0ffD5/WptPZy/Nii0XM9EvDoh2tbHWS3N9V5IXAAD8O8CkbGWptcsFymw8+Jz744qEAABgUBeyWFQJluvw1OVeJAQAAKNmoRLMMBZOQ31CFRICAID8LhQdpVy4UyzbRCcydQAJAQDAqBOZ+7bZJupOJr5+IyEAAMjuQov497Q+b8Kd/Ccvqu5FQgAAkN2Fjod9c+Pzem+bbTr1IyEAAEheX2f8IsSeFAnbAAAAAElFTkSuQmCC";

// font
MinecraftButtonLibrary.Resources.base64Font = "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AICAgID/AP8AAgCAgICAgICAAAAAAQAAAgAAgAOAAAMAABkBMxGAAgABgP6AAAAAAAUAAAAAAgADgAADAAcACwAPABMAACE1IRUlNTMVJREzGQE1MxU9ASEVAQABAP6AgP8AgIABAICAgICAgAGA/oABgICAgICAAAUAAAAAAgADgAADAAcACwAPABMAADE1IRU9ATMVNREzEQE1MxUlNSEVAQCAgP8AgP6AAQCAgICAgIABgP6AAYCAgICAgAAAAAUAAAEAAgACgAADAAcACwAPABMAABE1MxUhNTMVJTUhFSU1MxUhNTMVgAEAgP6AAQD+gIABAIABAICAgICAgICAgICAgAAAAAEAAACAAoADAAALAAAlESE1IREzESEVIREBAP8AAQCAAQD/AIABAIABAP8AgP8AAAEAAP+AAIABAAADAAAVETMRgIABgP6AAAEAAAGAAoACAAADAAARNSEVAoABgICAAAEAAAAAAIABAAADAAAxETMRgAEA/wAAAAUAAAAAAoADgAADAAcACwAPABMAADE1MxU1ETMZATUzFTURMxkBNTMVgICAgICAgIABAP8AAQCAgIABAP8AAQCAgAAABQAAAAACgAOAAAMABwAPABcAGwAAMzUhFQE1MxUBETMRMxUjFSERIzUzNTMRATUhFYABgP8AgP6AgICAAYCAgID+AAGAgIABgICA/wACgP6AgIABgICA/YACgICAAAAAAQAAAAACgAOAAAsAADE1IREjNTM1MxEhFQEAgICAAQCAAgCAgP0AgAAAAAAGAAAAAAKAA4AABwALAA8AEwAXABsAADERMxUhNTMRATUzFT0BIRUBNTMVBREzEQE1IRWAAYCA/gCAAQD+AIABgID+AAGAAQCAgP8AAQCAgICAgAEAgICAAQD/AAEAgIAAAAAABwAAAAACgAOAAAMABwALAA8AEwAXABsAADM1IRUlNTMVIREzEQE1IRUBNTMVBREzEQE1IRWAAYD+AIABgID+gAEA/gCAAYCA/gABgICAgICAAQD/AAEAgIABAICAgAEA/wABAICAAAADAAAAAAKAA4AAAwAHABMAABM1MxU9ATMVExEhETMVIREjNSERgICAgP4AgAGAgAEAAgCAgICAgP2AAQABAIABgID8gAAAAAAEAAAAAAKAA4AAAwAHAAsAEwAAMzUhFSU1MxUhETMRAREhFSEVIRWAAYD+AIABgID9gAKA/gABgICAgICAAYD+gAGAAYCAgIAAAAAABQAAAAACgAOAAAMABwAPABMAFwAAMzUhFTURMxEhETMVIRUhGQE1MxU9ASEVgAGAgP2AgAGA/oCAAQCAgIABAP8AAgCAgP8AAgCAgICAgAADAAAAAAKAA4AAAwAHAA8AACERMxkBNTMVNREhFSMRIREBAICA/oCAAoABgP6AAYCAgIABAIABAP6AAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAMzUhFSURMxEhETMRATUhFSURMxEhETMRATUhFYABgP4AgAGAgP4AAYD+AIABgID+AAGAgICAAQD/AAEA/wABAICAgAEA/wABAP8AAQCAgAAAAAAFAAAAAAKAA4AAAwAHAAsAEwAXAAAzNSEVPQEzFQERMxEBNSE1IREzEQE1IRWAAQCA/gCAAYD+gAGAgP4AAYCAgICAgAGAAQD/AP8AgIABAP4AAgCAgAAAAgAAAAAAgAKAAAMABwAAMREzEQMRMxGAgIABAP8AAYABAP8AAAAAAAIAAP+AAIACgAADAAcAABURMxEDETMRgICAgAGA/oACAAEA/wAAAAAHAAAAAAIAA4AAAwAHAAsADwATABcAGwAAITUzFSU1MxUlNTMVJTUzFT0BMxU9ATMVPQEzFQGAgP8AgP8AgP8AgICAgICAgICAgICAgICAgICAgICAgICAAAAAAAIAAACAAoACAAADAAcAAD0BIRUBNSEVAoD9gAKAgICAAQCAgAAAAAAHAAAAAAIAA4AAAwAHAAsADwATABcAGwAAMTUzFT0BMxU9ATMVPQEzFSU1MxUlNTMVJTUzFYCAgID/AID/AID/AICAgICAgICAgICAgICAgICAgICAgAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAhNTMVAzUzFT0BMxUBNTMVBREzEQE1IRUBAICAgID+AIABgID+AAGAgIABAICAgICAAQCAgIABAP8AAQCAgAAAAAQAAAAAAwADgAADAAcADwATAAAzNSEVJREzETcRIREzETMRATUhFYACAP2AgIABAICA/YACAICAgAKA/YCAAYD/AAGA/gACAICAAAACAAAAAAKAA4AACwAPAAAxETMVITUzESMRIRkBNSEVgAGAgID+gAGAAwCAgP0AAgD+AAMAgIAAAAMAAAAAAoADgAADAAcAEwAAJREzEQM1MxUBESEVIRUhFSERIRUCAICAgP2AAgD+gAGA/oABgIABgP6AAgCAgP2AA4CAgID+gIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVPQEzFSERMxEBNTMVJTUhFYABgID9gIABgID+AAGAgICAgIACgP2AAgCAgICAgAACAAAAAAKAA4AAAwALAAAlETMRBREhFSERIRUCAID9gAIA/oABgIACgP2AgAOAgP2AgAAAAQAAAAACgAOAAAsAADERIRUhFSEVIREhFQKA/gABAP8AAgADgICAgP6AgAABAAAAAAKAA4AACQAAMREhFSEVIRUhEQKA/gABAP8AA4CAgID+AAAABAAAAAACgAOAAAMACQANABEAADM1IRU1ESM1IREhETMZATUhFYABgIABAP2AgAIAgICAAYCA/gACgP2AAoCAgAAAAAABAAAAAAKAA4AACwAAMREzESERMxEjESERgAGAgID+gAOA/wABAPyAAgD+AAAAAAABAAAAAAGAA4AACwAAMTUzESM1IRUjETMVgIABgICAgAKAgID9gIAAAwAAAAACgAOAAAMABwALAAAzNSEVJTUzFSERMxGAAYD+AIABgICAgICAgAMA/QAABQAAAAACgAOAAAMABwALABMAFwAAIREzEQE1MxUDNTMVAREzESEVIREBNTMVAgCA/wCAgID+AIABAP8AAYCAAYD+gAGAgIABAICA/YADgP8AgP4AAwCAgAAAAAABAAAAAAKAA4AABQAAMREzESEVgAIAA4D9AIAAAwAAAAACgAOAAAMACwATAAABNTMVAREzFTMVIxEhESM1MzUzEQEAgP6AgICAAYCAgIACAICA/gADgICA/YACgICA/IAAAAAAAwAAAAACgAOAAAMACwATAAABNTMVAREzFTMVIxEhESM1MxEzEQEAgP6AgICAAYCAgIACAICA/gADgICA/YABgIABgPyAAAAABAAAAAACgAOAAAMABwALAA8AADM1IRUlETMRIREzEQE1IRWAAYD+AIABgID+AAGAgICAAoD9gAKA/YACgICAAAIAAAAAAoADgAADAA0AAAE1MxUBESEVIRUhFSERAgCA/YACAP6AAYD+gAKAgID9gAOAgICA/gAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVMzUzFSU1MxUhETMRJREzEQE1IRWAAQCAgP8AgP4AgAGAgP4AAYCAgICAgICAAoD9gIACAP4AAgCAgAAAAAMAAAAAAoADgAADAAcAEQAAIREzEQM1MxUBESEVIRUhFSERAgCAgID9gAIA/oABgP6AAgD+AAKAgID9gAOAgICA/gAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVJTUzFSERMxEBNSEVJTUzFT0BIRWAAYD+AIABgID+AAGA/gCAAgCAgICAgAGA/oABgICAgICAgICAAAAAAAEAAAAAAoADgAAHAAAhESE1IRUhEQEA/wACgP8AAwCAgP0AAAMAAAAAAoADgAADAAcACwAAMzUhFSURMxEhETMRgAGA/gCAAYCAgICAAwD9AAMA/QAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAhNTMVJREzETMRMxEBETMRIREzEQEAgP8AgICA/gCAAYCAgICAAQD/AAEA/wABAAIA/gACAP4AAAAAAAMAAAAAAoADgAADAAsAEwAAATUzFQERMxEzFSMVITUjNTMRMxEBAID+gICAgAGAgICAAQCAgP8AA4D9gICAgIACgPyAAAAAAAkAAAAAAoADgAADAAcACwAPABMAFwAbAB8AIwAAMREzESERMxEBNTMVMzUzFSU1MxUlNTMVMzUzFSU1MxUhNTMVgAGAgP4AgICA/wCA/wCAgID+AIABgIABgP6AAYD+gAGAgICAgICAgICAgICAgICAgIAABQAAAAACgAOAAAMABwALAA8AEwAAIREzEQE1MxUzNTMVJTUzFSE1MxUBAID/AICAgP4AgAGAgAKA/YACgICAgICAgICAgAAABQAAAAACgAOAAAUACQANABEAFwAAMREzFSEVATUzFT0BMxU9ATMVPQEhNSERgAIA/gCAgID+AAKAAQCAgAEAgICAgICAgICAgID/AAAAAAABAAAAAAGAA4AABwAAMREhFSERIRUBgP8AAQADgID9gIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAhNTMVJREzEQE1MxUlETMRATUzFQIAgP8AgP8AgP8AgP8AgICAgAEA/wABAICAgAEA/wABAICAAAAAAAEAAAAAAYADgAAHAAAxNSERITUhEQEA/wABgIACgID8gAAAAAUAAAIAAoADgAADAAcACwAPABMAABE1MxUhNTMVJTUzFTM1MxUlNTMVgAGAgP4AgICA/wCAAgCAgICAgICAgICAgIAAAQAA/4ACgAAAAAMAABU1IRUCgICAgAAAAQAAAwABAAOAAAMAABE1IRUBAAMAgIAAAwAAAAACgAKAAAMADQARAAA9ATMdATUhNSE1ITUzEQE1IRWAAYD+gAGAgP4AAYCAgICAgICAgP4AAgCAgAAAAAMAAAAAAoADgAADAAcAEQAAJREzEQE1IRUBETMRMxUjESEVAgCA/oABAP4AgICAAYCAAYD+gAGAgID+AAOA/oCA/wCAAAAAAAUAAAAAAoACgAADAAcACwAPABMAADM1IRU9ATMVIREzEQE1MxUlNSEVgAGAgP2AgAGAgP4AAYCAgICAgAGA/oABAICAgICAAAMAAAAAAoADgAADAAcAEQAANREzGQE1IRUBNSERIzUzETMRgAEA/wABgICAgIABgP6AAYCAgP4AgAEAgAGA/IAAAAAAAwAAAAACgAKAAAMADQARAAAzNSEVJREzFSE1MxEhFRE1IRWAAgD9gIABgID+AAGAgICAAYCAgP8AgAGAgIAAAAIAAAAAAgADgAALAA8AADMRIzUzNTMVIRUhGQE1IRWAgICAAQD/AAEAAgCAgICA/gADAICAAAAAAwAA/4ACgAKAAAMABwARAAAVNSEVAREzEQE1ITUhESE1IRECAP4AgAGA/oABgP6AAgCAgIABgAEA/wD/AICAAQCA/YAAAAAAAwAAAAACgAOAAAMABwAPAAAhETMRATUhFQERMxEzFSMRAgCA/oABAP4AgICAAgD+AAIAgID+AAOA/oCA/oAAAAIAAAAAAIADgAADAAcAADERMxEDNTMVgICAAoD9gAMAgIAAAAQAAP+AAoADAAADAAcACwAPAAAXNSEVJREzESERMxEDNTMVgAGA/gCAAYCAgICAgICAAQD/AAIA/gACgICAAAAFAAAAAAIAA4AAAwAHAAsADwAXAAAhNTMVJTUzFQM1MxU9ATMVAREzETMVIxEBgID/AICAgID+AICAgICAgICAAQCAgICAgP4AA4D+AID/AAAAAAACAAAAAAEAA4AAAwAHAAAzNTMVJREzEYCA/wCAgICAAwD9AAAEAAAAAAKAAoAAAwAHAA0AEQAAAREzERMRMxEhESEVIxEBNTMVAQCAgID9gAEAgAEAgAEAAQD/AP8AAgD+AAKAgP4AAgCAgAACAAAAAAKAAoAAAwAJAAAhETMRIREhFSERAgCA/YACAP6AAgD+AAKAgP4AAAQAAAAAAoACgAADAAcACwAPAAAzNSEVJREzESERMxEBNSEVgAGA/gCAAYCA/gABgICAgAGA/oABgP6AAYCAgAADAAD/gAKAAoAAAwAPABMAAAERMxEBETMVMxUjFSEVIRETNSEVAgCA/YCAgIABgP6AgAEAAQABAP8A/oADAICAgID/AAKAgIAAAAAAAwAA/4ACgAKAAAMABwATAAAZATMZATUhFRMRITUhNSM1MzUzEYABAID+gAGAgICAAQABAP8AAQCAgP2AAQCAgICA/QAAAAAAAwAAAAACgAKAAAMACwAPAAABNTMVAREzFTMVIxETNSEVAgCA/YCAgICAAQABgICA/oACgICA/oACAICAAAAAAAUAAAAAAoACgAADAAcACwAPABMAADE1IRU9ATMVJTUhFSU1MxU9ASEVAgCA/gABgP4AgAIAgICAgICAgICAgICAgIAAAgAAAAABgAOAAAMADwAAITUzFSURIzUzETMRMxUjEQEAgP8AgICAgICAgIABgIABAP8AgP6AAAACAAAAAAKAAoAAAwAJAAA1ETMRFTUhETMRgAGAgIACAP4AgIACAP2AAAAAAAUAAAAAAoACgAADAAcACwAPABMAACE1MxUlNTMVMzUzFSURMxEhETMRAQCA/wCAgID+AIABgICAgICAgICAgAGA/oABgP6AAAIAAAAAAoACgAADAA0AADURMxEVNTMRMxEzETMRgICAgICAAgD+AICAAQD/AAIA/YAAAAAJAAAAAAKAAoAAAwAHAAsADwATABcAGwAfACMAADE1MxUhNTMVJTUzFTM1MxUlNTMVJTUzFTM1MxUlNTMVITUzFYABgID+AICAgP8AgP8AgICA/gCAAYCAgICAgICAgICAgICAgICAgICAgICAgAAAAwAA/4ACgAKAAAMABwAPAAAXNSEVAREzEQE1ITUhETMRgAGA/gCAAYD+gAGAgICAgAGAAYD+gP8AgIABgP2AAAMAAAAAAoACgAAHAAsAEwAAMTUzNTMVIRUBNTMVPQEhNSEVIxWAgAGA/oCA/oACgICAgICAAQCAgICAgICAAAAFAAAAAAIAA4AAAwAHAAsADwATAAAhNSEVJREzEQE1MxU1ETMZATUhFQEAAQD+gID/AICAAQCAgIABAP8AAQCAgIABAP8AAQCAgAAAAQAAAAAAgAOAAAMAADERMxGAA4D8gAAABQAAAAACAAOAAAMABwALAA8AEwAAMTUhFTURMxkBNTMVJREzEQE1IRUBAICA/wCA/oABAICAgAEA/wABAICAgAEA/wABAICAAAAAAAQAAAKAAwADgAADAAcACwAPAAARNTMVITUhFSU1IRUhNTMVgAEAAQD+AAEAAQCAAoCAgICAgICAgIAAAAIAAAAAAIADgAADAAcAADERMxEDNTMVgICAAoD9gAMAgIAAAAMAAAAAAgADAAADAAcACwAAMzUhFSURMxkBNSEVgAGA/gCAAYCAgIACAP4AAgCAgAAAAAACAAAAAAIAAwAADwATAAAxNTMRIzUzNTMVMxUjESEVATUzFYCAgICAgAEA/wCAgAEAgICAgP8AgAKAgIAAAAAABQAAAQABgAKAAAMABwALAA8AEwAAETUzFTM1MxUlNTMVJTUzFTM1MxWAgID/AID/AICAgAEAgICAgICAgICAgICAAAAFAAAAAAKAA4AAEwAXABsAHwAjAAAhNSM1MzUjNTM1MxUzFSMVMxUjFQE1MxUzNTMVJTUzFSE1MxUBAICAgICAgICAgP8AgICA/gCAAYCAgICAgICAgICAgAKAgICAgICAgICAAAAAAAIAAAAAAIADgAADAAcAADERMxEDETMRgICAAYD+gAIAAYD+gAAAAAAFAAD/gAKAAwAABwALAA8AEwAbAAAFNSM1IRUjFRM1MxUhETMRATUzFSU1MzUzFTMVAQCAAYCAgID9gIABgID+AICAgICAgICAAQCAgAGA/oABAICAgICAgIAAAAMAAAAAAwADgAAHAAsADwAAAREhFSMVMxUXESERBxEhEQEAAQCAgID+AIADAAEAAYCAgICAAoD9gIADgPyAAAABAAABAAGAAwAABwAAGQEhNSE1IREBAP8AAYABAAEAgID+AAAKAAAAAAKAAoAAAwAHAAsADwATABcAGwAfACMAJwAAITUzFTM1MxUlNTMVMzUzFSU1MxUzNTMVJTUzFTM1MxUlNTMVMzUzFQEAgICA/gCAgID+AICAgP8AgICA/wCAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAAAAAQAAAIACgAGAAAUAACU1ITUhEQIA/gACgICAgP8AAAABAIABAAIAAYAAAwAAEzUhFYABgAEAgIAAAAAAAwAAAAADAAOAAAUADQARAAABESERIxUFNSM1MxEhEQcRIREBAAEAgAEAgID+AIADAAEAAYD/AICAgIABgP2AgAOA/IAAAAAAAQAAAwACgAOAAAMAABE1IRUCgAMAgIAAAgAAAgABgAOAAAMABwAAATUjFQcRIREBAICAAYACgICAgAGA/oAAAAIAAP+AAoADAAADAA8AABU1IRUBESE1IREzESEVIRECgP6A/wABAIABAP8AgICAAQABAIABAP8AgP8AAAIAAAIAAQADgAAFAAkAABkBMxUzFQM1MxWAgICAAgABAICAAQCAgAABAAACAAEAA4AABwAAETUzNSM1IRGAgAEAAgCAgID+gAAAAAABAYADAAKAA4AAAwAAATUhFQGAAQADAICAAAAAAQAA/4ACgAMAAAkAABURMxEhETMRIRWAAYCA/gCAA4D9gAKA/QCAAAMAAAAAAoADAAADAA0AEQAAETUzFRMRIzUzNSM1IREzETMRgICAgIABAICAAgCAgP4AAYCAgID9AAMA/QAAAAABAAABgACAAgAAAwAAETUzFYABgICAAAACAID/gAIAAIAAAwAHAAAXNSEVPQEzFYABAICAgICAgIAAAAABAAACgACAA4AAAwAAGQEzEYACgAEA/wAAAAAAAgAAAgABgAOAAAMABwAAATUjFQcRIREBAICAAYACgICAgAGA/oAAAAoAAAAAAoACgAADAAcACwAPABMAFwAbAB8AIwAnAAAxNTMVMzUzFSU1MxUzNTMVJTUzFTM1MxUlNTMVMzUzFSU1MxUzNTMVgICA/wCAgID/AICAgP4AgICA/gCAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAAgAAAAAAoADgAADAAkADQARABUAGQAdACEAADE1MxUhETMVMxUlETMRJTUzFSU1MxU1ETMRJREzESU1MxWAAQCAgP4AgAEAgP6AgID+AIABgICAgAEAgICAAQD/AICAgICAgIABAP8AgAEA/wCAgIAAAAAABwAAAAACgAOAAAMABwANABEAFQAZAB0AADE1MxU1ETMRBTUjESERATUzFTURMxElETMRJTUzFYCAAQCAAQD+gICA/gCAAYCAgICAAQD/AICAAQD+gAGAgICAAQD/AIABAP8AgICAAAAHAAAAAAKAA4AAAwAHAA0AEQAVAB0AIQAAMTUzFTURMxEFNSMRIREBNTMVNREzESE1MzUjNSERATUzFYCAAQCAAQD+gICA/gCAgAEAAQCAgICAAQD/AICAAQD+gAGAgICAAQD/AICAgP6AAQCAgAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVPQEzFSERMxkBNTMVPQEzFQM1MxWAAYCA/YCAgICAgICAgICAAQD/AAEAgICAgIABAICAAAADAAAAAAKAA4AACwAPABMAADERMxUhNTMRIxEhGQE1IRUBNSEVgAGAgID+gAGA/gABAAIAgID+AAEA/wACAICAAQCAgAAAAAADAAAAAAKAA4AACwAPABMAADERMxUhNTMRIxEhGQE1IRUDNSEVgAGAgID+gAGAgAEAAgCAgP4AAQD/AAIAgIABAICAAAUAAAAAAoADgAALAA8AEwAXABsAADERMxUhNTMRIxEhGQE1IRUlNTMVITUzFSU1IRWAAYCAgP6AAYD+AIABgID+AAGAAgCAgP4AAQD/AAIAgICAgICAgICAgAAABQAAAAADAAOAAAsADwAXABsAHwAAMREzFSE1MxEjESERAzUzHQE1ITUhFSMVATUhFSE1MxWAAYCAgP6AgIABAAEAgP6AAQABAIACAICA/gABAP8AAoCAgICAgICAAQCAgICAAAQAAAAAAoADgAALAA8AEwAXAAAxETMVITUzESMRIRkBNSEVATUzFTM1MxWAAYCAgP6AAYD+gICAgAIAgID+AAEA/wACAICAAQCAgICAAAAAAwAAAAACgAOAAAsADwATAAAxETMVITUzESMRIRkBNSEVATUzFYABgICA/oABgP8AgAIAgID+AAEA/wACAICAAQCAgAABAAAAAAKAA4AAFQAAMREzFTM1IzUhFSEVMxUjESEVIREjEYCAgAIA/wCAgAEA/oCAAwCAgICAgID+gIACAP4AAAAAAAcAAP+AAoADgAADAAcACwAPABMAFwAbAAAFNSEVPQEzFSU1IRU9ATMVIREzEQE1MxUlNSEVAQABAID+AAGAgP2AgAGAgP4AAYCAgICAgICAgICAgIACAP4AAYCAgICAgAAAAAACAAAAAAKAA4AACwAPAAAxESEVIRUhFSEVIRUBNSEVAoD+AAEA/wACAP2AAQACgICAgICAAwCAgAAAAAACAAAAAAKAA4AACwAPAAAxESEVIRUhFSEVIRUBNSEVAoD+AAEA/wACAP8AAQACgICAgICAAwCAgAAAAAAFAAAAAAKAA4AACQANABEAFQAZAAAxETMVIRUhFSEVATUhFSU1MxUhNTMVJTUhFYABAP8AAgD+AAGA/gCAAYCA/gABgAIAgICAgAIAgICAgICAgICAgAAAAwAAAAACgAOAAAsADwATAAAxESEVIRUhFSEVIRUBNTMVMzUzFQKA/gABAP8AAgD+AICAgAKAgICAgIADAICAgIAAAAACAAAAAAIAA4AACwAPAAAzNTMRIzUhFSMRMxUBNSEVgICAAYCAgP4AAQCAAYCAgP6AgAMAgIAAAAIAgAAAAoADgAALAA8AADM1MxEjNSEVIxEzFQM1IRWAgIABgICAgAEAgAGAgID+gIADAICAAAAABAAAAAACgAOAAAsADwATABcAADM1MxEjNSEVIxEzFQE1MxUhNTMVJTUhFYCAgAGAgID+AIABgID+AAGAgAGAgID+gIACgICAgICAgIAAAAADAAAAAAGAA4AACwAPABMAADE1MxEjNSEVIxEzFQE1MxUzNTMVgIABgICA/oCAgICAAYCAgP6AgAMAgICAgAAAAgAAAAADAAOAAAMAEwAAJREzEQURIzUzESEVIREzFSMRIRUCgID9gICAAgD+gICAAYCAAoD9gIABgIABgID/AID/AIAAAAAABQAAAAADAAOAAAMACwAVABkAHQAAATUzFQERMxEzFSMRITUjNTMRIzUhEQE1IRUhNTMVAQCA/oCAgIABgICAgAEA/gABAAEAgAEAgID/AAMA/wCA/oCAgAGAgP0AAwCAgICAAAUAAAAAAoADgAADAAcACwAPABMAADM1IRUlETMRIREzEQE1IRUBNSEVgAGA/gCAAYCA/gABgP4AAQCAgIABgP6AAYD+gAGAgIABAICAAAAABQAAAAACgAOAAAMABwALAA8AEwAAMzUhFSURMxEhETMRATUhFQM1IRWAAYD+AIABgID+AAGAgAEAgICAAYD+gAGA/oABgICAAQCAgAAAAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAMzUhFSURMxEhETMRATUhFSU1MxUhNTMVJTUhFYABgP4AgAGAgP4AAYD+AIABgID+AAGAgICAAYD+gAGA/oABgICAgICAgICAgIAABwAAAAADAAOAAAMABwALAA8AFwAbAB8AADM1IRUlETMRIREzEQE1Mx0BNSE1IRUjFQE1IRUhNTMVgAGA/gCAAYCA/YCAAQABAID+gAEAAQCAgICAAYD+gAGA/oACAICAgICAgIABAICAgIAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVJREzESERMxEBNSEVJTUzFSE1MxWAAYD+AIABgID+AAGA/gCAAYCAgICAAgD+AAIA/gACAICAgICAgIAAAAkAAACAAoADAAADAAcACwAPABMAFwAbAB8AIwAAPQEzFSE1MxUlNTMVMzUzFSU1MxUlNTMVMzUzFSU1MxUhNTMVgAGAgP4AgICA/wCA/wCAgID+AIABgICAgICAgICAgICAgICAgICAgICAgICAgAADAAAAAAKAA4AAAwANABcAAAERMxEBNSMRMxEzFSEVNREjNSE1IRUzEQEAgP8AgICAAQCA/wABgIABAAGA/oD/AIACgP4AgICAAgCAgID9gAAAAAAEAAAAAAKAA4AAAwAHAAsADwAAMzUhFSURMxEhETMRATUhFYABgP4AgAGAgP2AAQCAgIACAP4AAgD+AAKAgIAABAAAAAACgAOAAAMABwALAA8AADM1IRUlETMRIREzEQE1IRWAAYD+AIABgID/AAEAgICAAgD+AAIA/gACgICAAAYAAAAAAoADgAADAAcACwAPABMAFwAAMzUhFSURMxEhETMRATUzFSE1MxUlNSEVgAGA/gCAAYCA/YCAAYCA/gABgICAgAGA/oABgP6AAgCAgICAgICAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVJREzESERMxEBNTMVMzUzFYABgP4AgAGAgP4AgICAgICAAgD+AAIA/gACgICAgIAAAAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAhETMRATUzFTM1MxUlNTMVITUzFQE1IRUBAID/AICAgP4AgAGAgP2AAQABgP6AAYCAgICAgICAgIABAICAAAAAAAMAAP+AAoADAAADAAcAEwAAJREzEQE1IRUBETMRMxUjESEVIRUCAID+gAEA/gCAgIABgP6AgAGA/oABgICA/YADgP8AgP8AgIAAAAAEAAAAAAKAA4AAAwANABEAFQAAPQEzHQE1ITUhNSE1MxEBNSEVATUhFYABgP6AAYCA/gABgP4AAQCAgICAgICAgP4AAgCAgAEAgIAABAAAAAACgAOAAAMADQARABUAAD0BMx0BNSE1ITUhNTMRATUhFQM1IRWAAYD+gAGAgP4AAYCAAQCAgICAgICAgP4AAgCAgAEAgIAAAAYAAAAAAoADgAADAA0AEQAVABkAHQAAPQEzHQE1ITUhNSE1MxEBNSEVJTUzFSE1MxUlNSEVgAGA/oABgID+AAGA/gCAAYCA/gABgICAgICAgICA/gACAICAgICAgICAgIAAAAAGAAAAAAMAA4AAAwANABEAGQAdACEAAD0BMx0BNSE1ITUhNTMRATUzHQE1ITUhFSMVATUhFSE1MxWAAYD+gAGAgP2AgAEAAQCA/oABAAEAgICAgICAgICA/gACgICAgICAgIABAICAgIAAAAAFAAAAAAKAA4AAAwANABEAFQAZAAA9ATMdATUhNSE1ITUzEQE1IRUBNTMVMzUzFYABgP6AAYCA/gABgP6AgICAgICAgICAgID+AAIAgIABAICAgIAAAAAABAAAAAACgAOAAAMADQARABUAAD0BMx0BNSE1ITUhNTMRATUhFQE1MxWAAYD+gAGAgP4AAYD/AICAgICAgICAgP4AAgCAgAEAgIAAAAQAAAAAAoACgAADABUAGQAdAAA9ATMdATUzNSM1MzUzFTM1MxEhFSEVATUzFTM1MxWAgICAgICA/wABAP4AgICAgICAgICAgICAgP8AgIACAICAgIAAAAAHAAD/gAKAAwAAAwAHAAsADwATABcAGwAABTUhFT0BMxUlNSEVPQEzFSERMxEBNTMVJTUhFQEAAQCA/gABgID9gIABgID+AAGAgICAgICAgICAgICAAYD+gAEAgICAgIAAAAAABAAAAAACgAOAAAMADQARABUAADM1IRUlETMVITUzESEVETUhFQE1IRWAAgD9gIABgID+AAGA/gABAICAgAGAgID/AIABgICAAQCAgAAAAAAEAAAAAAKAA4AAAwANABEAFQAAMzUhFSURMxUhNTMRIRURNSEVAzUhFYACAP2AgAGAgP4AAYCAAQCAgIABgICA/wCAAYCAgAEAgIAABgAAAAACgAOAAAMADQARABUAGQAdAAAzNSEVJREzFSE1MxEhFRE1IRUlNTMVITUzFSU1IRWAAgD9gIABgID+AAGA/gCAAYCA/gABgICAgAGAgID/AIABgICAgICAgICAgIAAAAUAAAAAAoADgAADAA0AEQAVABkAADM1IRUlETMVITUzESEVETUhFQE1MxUzNTMVgAIA/YCAAYCA/gABgP6AgICAgICAAYCAgP8AgAGAgIABAICAgIAAAAACAAAAAAEAA4AAAwAHAAAzETMRATUhFYCA/wABAAKA/YADAICAAAAAAgAAAAABAAOAAAMABwAAMREzEQM1IRWAgAEAAoD9gAMAgIAABAAAAAACgAOAAAMABwALAA8AACERMxEBNTMVITUzFSU1IRUBAID+gIABgID+AAGAAoD9gAKAgICAgICAgAAAAAMAgAAAAgADgAADAAcACwAAIREzEQE1MxUzNTMVAQCA/wCAgIACgP2AAwCAgICAAAQAAAAAAwADgAADAA8AEwAXAAAhETMRIREzFSE1IRUjFSEZATUhFSE1MxUCAID9gIABAAEAgP6AAQABAIACAP4AAwCAgICA/gADAICAgIAABQAAAAACgAOAAAMABwALAA8AEwAAMzUhFSURMxEhETMRATUhFQE1IRWAAYD+AIABgID+AAGA/gABAICAgAGA/oABgP6AAYCAgAEAgIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVJREzESERMxEBNSEVAzUhFYABgP4AgAGAgP4AAYCAAQCAgIABgP6AAYD+gAGAgIABAICAAAAAAAcAAAAAAoADgAADAAcACwAPABMAFwAbAAAzNSEVJREzESERMxEBNSEVJTUzFSE1MxUlNSEVgAGA/gCAAYCA/gABgP4AgAGAgP4AAYCAgIABgP6AAYD+gAGAgICAgICAgICAgAAHAAAAAAMAA4AAAwAHAAsADwAXABsAHwAAMzUhFSURMxEhETMRATUzHQE1ITUhFSMVATUhFSE1MxWAAYD+AIABgID9gIABAAEAgP6AAQABAICAgIABgP6AAYD+gAIAgICAgICAgAEAgICAgAAGAAAAAAKAA4AAAwAHAAsADwATABcAADM1IRUlETMRIREzEQE1IRUBNTMVMzUzFYABgP4AgAGAgP4AAYD+gICAgICAgAGA/oABgP6AAYCAgAEAgICAgAAAAwAAAIACgAMAAAMABwALAAAlNTMVATUhFQE1MxUBAID+gAKA/oCAgICAAQCAgAEAgIAAAAMAAAAAAoACgAADAA0AFwAAATUzFQE1IxEzETMVIRU1ESM1ITUhFTMRAQCA/wCAgIABAID/AAGAgAEAgID/AIABgP8AgICAAQCAgID+gAAAAwAAAAACgAOAAAMACQANAAA1ETMRFTUhETMRATUhFYABgID9gAEAgAIA/gCAgAIA/YADAICAAAADAAAAAAKAA4AAAwAJAA0AADURMxEVNSERMxEBNSEVgAGAgP8AAQCAAgD+AICAAgD9gAMAgIAAAAUAAAAAAoADgAADAAkADQARABUAADURMxEVNSERMxEBNTMVITUzFSU1IRWAAYCA/YCAAYCA/gABgIABgP6AgIABgP4AAoCAgICAgICAAAAABAAAAAACgAOAAAMACQANABEAADURMxEVNSERMxEBNTMVMzUzFYABgID+AICAgIACAP4AgIACAP2AAwCAgICAAAQAAP+AAoADgAADAAcADwATAAAXNSEVAREzEQE1ITUhETMRATUhFYABgP4AgAGA/oABgID9gAEAgICAAYABgP6A/wCAgAGA/YADAICAAAAAAwAA/4ACgAOAAAMABwATAAAlETMRATUhFQERMxEzFSMRIRUhFQIAgP6AAQD+AICAgAGA/oCAAYD+gAGAgID9gAQA/oCA/wCAgAAAAAUAAP+AAoADgAADAAcADwATABcAABc1IRUBETMRATUhNSERMxEBNTMVMzUzFYABgP4AgAGA/oABgID+AICAgICAgAGAAYD+gP8AgIABgP2AAwCAgICAAAACAAAAAAKAA4AAAwATAAA1ETMRFTUzESM1IRUhFTMVIxEhFYCAgAIA/wCAgAEAgAKA/YCAgAKAgICAgP6AgAAABQAAAAACgAKAAAMABwALAA8AGwAAMzUzFTM1IRUlETMZATUzFRkBMxUzNSM1IREhFYCAgAEA/YCAgICAgAEA/wCAgICAgAGA/oABgICA/oABgICAgP6AgAAAAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAIREzEQE1MxUzNTMVJTUzFSE1MxUBNTMVMzUzFQEAgP8AgICA/gCAAYCA/gCAgIABgP6AAYCAgICAgICAgIABAICAgIAAAAABAAABgAMAAgAAAwAAETUhFQMAAYCAgAACAAACAAEAA4AAAwAHAAAZATMZATUzFYCAAgABAP8AAQCAgAACAAACAAEAA4AAAwAHAAARNTMVNREzEYCAAgCAgIABAP8AAAACAAD/gAEAAQAAAwAHAAAVNTMVNREzEYCAgICAgAEA/wAAAAACAAACAAEAA4AAAwAHAAATNTMVJREzEYCA/wCAAgCAgIABAP8AAAAABAAAAgACAAOAAAMABwALAA8AABkBMxEzETMRATUzFTM1MxWAgID/AICAgAIAAQD/AAEA/wABAICAgIAABAAAAgACAAOAAAMABwALAA8AABE1MxUzNTMVJREzETMRMxGAgID/AICAgAIAgICAgIABAP8AAQD/AAAABAAA/4ACAAEAAAMABwALAA8AABU1MxUzNTMVJREzETMRMxGAgID/AICAgICAgICAgAEA/wABAP8AAAAAAQAAAAABgAMAAAsAADMRIzUzETMRMxUjEYCAgICAgAGAgAEA/wCA/oAAAAABAAABgAEAAoAAAwAAGQEhEQEAAYABAP8AAAAAAwAAAAACgACAAAMABwALAAAxNTMVMzUzFTM1MxWAgICAgICAgICAgAAAAAADAAAAAAEAAYAAAwAHAAsAADM1MxUlNTMVPQEzFYCA/wCAgICAgICAgICAAAMAAAAAAQABgAADAAcACwAAMTUzFT0BMxUlNTMVgID/AICAgICAgICAgAAAAwAAAAACgAOAAAMAFwAbAAAhNSEVJTUjNTM1IzUzNTMVIRUhFSEVIRURNSEVAQABgP4AgICAgIABAP8AAQD/AAGAgICAgICAgICAgICAgAKAgIAAAgAAAgAEgAOAAAcAEwAAExEjNSEVIxEhESERIxEjFSM1IxGAgAGAgAEAAoCAgICAAgABAICA/wABgP6AAQCAgP8AAAAAACABhgABAAAAAAAAASUCTAABAAAAAAABAAkDhgABAAAAAAACAAcDoAABAAAAAAADABEDzAABAAAAAAAEABEEAgABAAAAAAAFAAsELAABAAAAAAAGAAkETAABAAAAAAAHAGMFHgABAAAAAAAIABYFsAABAAAAAAAJAAUF0wABAAAAAAAKASUIJQABAAAAAAALAB8JiwABAAAAAAAMABEJzwABAAAAAAANACgKMwABAAAAAAAOAC4KugABAAAAAAATABsLIQADAAEECQAAAkoAAAADAAEECQABABIDcgADAAEECQACAA4DkAADAAEECQADACIDqAADAAEECQAEACID3gAD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IgAgAGYAbwBuAHQAIABpAHMAIAB1AG4AZABlAHIAIABDAHIAZQBhAHQAaQB2AGUAIABDAG8AbQBtAG8AbgBzACAATABpAGMAZQBuAHMAZQAgACgAUwBoAGEAcgBlACAAQQBsAGkAawBlACkALgANAAoADQAKAFQAaABlACAAIgBEAGoARABDAEgAIgAgAG4AYQBtAGUAIABpAHMAIABvAHcAbgAgAGIAeQAgAG0AZQAgACgAZABqAGQAYwBoAC4AYwBvAG0AKQAuAA0ACgANAAoAVABoAGUAIAAiAE0AaQBuAGUAYwByAGEAZgB0ACIAIABmAG8AbgB0ACAAcwB0AHkAbABlACAAdwBhAHMAIABtAGEAZABlACAAYgB5ACAATgBvAHQAYwBoAC4ADQAKAA0ACgBUAGgAZQAgACIATQBpAG4AZQBjAHIAYQBmAHQAIgAgAGcAYQBtAGUAIABpAHMAIABvAHcAbgAgAGIAeQAgAE0AbwBqAGEAbgBnACAAUwBwAGUAYwBpAGYAaQBjAGEAdABpAG8AbgBzAC4AAFRoaXMgIk1pbmVjcmFmdCIgZm9udCB3YXMgYWRhcHRlZCBpbnRvIFRydWVUeXBlIGZpbGUgYnkgbWUgKERqRENIKS4NCg0KVGhpcyAiTWluZWNyYWZ0IiBmb250IGlzIHVuZGVyIENyZWF0aXZlIENvbW1vbnMgTGljZW5zZSAoU2hhcmUgQWxpa2UpLg0KDQpUaGUgIkRqRENIIiBuYW1lIGlzIG93biBieSBtZSAoZGpkY2guY29tKS4NCg0KVGhlICJNaW5lY3JhZnQiIGZvbnQgc3R5bGUgd2FzIG1hZGUgYnkgTm90Y2guDQoNClRoZSAiTWluZWNyYWZ0IiBnYW1lIGlzIG93biBieSBNb2phbmcgU3BlY2lmaWNhdGlvbnMuAABoAHQAdABwADoALwAvAGYAbwBuAHQAcwB0AHIAdQBjAHQALgBmAG8AbgB0AHMAaABvAHAALgBjAG8AbQAvAABodHRwOi8vZm9udHN0cnVjdC5mb250c2hvcC5jb20vAABoAHQAdABwADoALwAvAGQAagBkAGMAaAAuAGMAbwBtAC8AAGh0dHA6Ly9kamRjaC5jb20vAABDAHIAZQBhAHQAaQB2AGUAIABDAG8AbQBtAG8AbgBzACAAQQB0AHQAcgBpAGIAdQB0AGkAbwBuACAAUwBoAGEAcgBlACAAQQBsAGkAawBlAABDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIFNoYXJlIEFsaWtlAABoAHQAdABwADoALwAvAGMAcgBlAGEAdABpAHYAZQBjAG8AbQBtAG8AbgBzAC4AbwByAGcALwBsAGkAYwBlAG4AcwBlAHMALwBiAHkALQBzAGEALwAzAC4AMAAvAABodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8zLjAvAABNAGkAbgBlAGMAcgBhAGYAdAAgAGkAcwAgAGoAdQBzAHQAIABhAHcAZQBzAG8AbQBlACAAIQAATWluZWNyYWZ0IGlzIGp1c3QgYXdlc29tZSAhAAAAAgAAAAAAAABlADMAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAABAgEDAAMABAAFAAYABwAIAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQCjAIQAhQC9AJYA6ACOAIsAnQCpAKQBBACKANoAgwCTAQUBBgCNAQcAiADDAN4BCACeAKoA9QD0APYAogCtAMkAxwCuAGIAYwCQAGQAywBlAMgAygDPAMwAzQDOAOkAZgDTANAA0QCvAGcA8ACRANYA1ADVAGgA6wDtAGoAaQBrAG0AbABuAKAAbwBxAHAAcgBzAHUAdAB2AHcAeAB6AHkAewB9AHwAuAChAH8AfgCAAIEA7ADuALoAsACxALsAswC2ALcAxAEJALQAtQDFAIIAhwCrAL4AvwEKAIwGZ2x5cGgxB3VuaTAwMEQHdW5pMDBBRAd1bmkwMEIyB3VuaTAwQjMHdW5pMDBCNQd1bmkwMEI5DXF1b3RlcmV2ZXJzZWQERXVybwAAAAH//wACAAEAAAAOAAAAGAAAAAAAAgABAAEAzwABAAQAAAACAAAAAAABAAAAAMw9os8AAAAAyO86mAAAAADI8I+a";

//########################################################################################################################################################
// START CREATION OF RESOURCES
//########################################################################################################################################################

new java.lang.Thread(new java.lang.Runnable()
{
	run: function()
	{
		try
		{
			MinecraftButtonLibrary.createNinePatchDrawables();
			MinecraftButtonLibrary.createTypeface();

			MinecraftButtonLibrary.removeResources();
		} catch(e)
		{
			print("Error " + e);
		}
	}
}).start();

