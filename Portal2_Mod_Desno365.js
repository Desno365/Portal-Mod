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
var bluePortal = "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";
var orangePortal = "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";
var overlay = "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";
var divider = "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";

// decoded images variables
var bluePortalScaled;
var orangePortalScaled;
var overlayScaled;
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

// TODO update variables names
// portal guns variables
var blueBullet;
var blueBulletLaunched = false;
var orangeBullet;
var orangeBulletLaunched = false;
var portalWithUseItem = false;

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

const ID_PORTAL_GUN_BLUE = 3651;
const PORTAL_GUN_DAMAGE = 1000;
Item.defineItem(ID_PORTAL_GUN_BLUE, "portalgunblue", 0, "PortalGun");
Item.setMaxDamage(ID_PORTAL_GUN_BLUE, PORTAL_GUN_DAMAGE);
Item.addShapedRecipe(ID_PORTAL_GUN_BLUE, 1, 0, [
	"f f",
	" d ",
	"f f"], ["f", 265, 0, "d", 264, 0]);
Item.setCategory(ID_PORTAL_GUN_BLUE, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(ID_PORTAL_GUN_BLUE);

const ID_PORTAL_GUN_GOLD = 3652;
const PORTAL_GUN_GOLD_DAMAGE = 500;
Item.defineItem(ID_PORTAL_GUN_GOLD, "portalgungold", 0, "PortalGun Gold");
Item.setMaxDamage(ID_PORTAL_GUN_GOLD, PORTAL_GUN_GOLD_DAMAGE);
Item.addShapedRecipe(ID_PORTAL_GUN_GOLD, 1, 0, [
	"f f",
	" g ",
	"f f"], ["f", 265, 0, "g", 266, 0]);
Item.setCategory(ID_PORTAL_GUN_GOLD, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(ID_PORTAL_GUN_GOLD);

const ID_PORTAL_GUN_IRON = 3653;
const PORTAL_GUN_IRON_DAMAGE = 250;
Item.defineItem(ID_PORTAL_GUN_IRON, "portalguniron", 0, "PortalGun Iron");
Item.setMaxDamage(ID_PORTAL_GUN_IRON, PORTAL_GUN_IRON_DAMAGE);
Item.addShapedRecipe(ID_PORTAL_GUN_IRON, 1, 0, [
	"fff",
	"f f",
	"fff"], ["f", 265, 0]);
Item.setCategory(ID_PORTAL_GUN_IRON, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(ID_PORTAL_GUN_IRON);

const ID_PORTAL_GUN_LAVA = 3654;
const PORTAL_GUN_LAVA_DAMAGE = 200;
Item.defineItem(ID_PORTAL_GUN_LAVA, "portalgunlava", 0, "PortalGun Lava");
Item.setMaxDamage(ID_PORTAL_GUN_LAVA, PORTAL_GUN_LAVA_DAMAGE);
Item.addShapedRecipe(ID_PORTAL_GUN_LAVA, 1, 0, [
	"f f",
	" a ",
	"f f"], ["f", 265, 0, "a", 259, 0]);
Item.setCategory(ID_PORTAL_GUN_LAVA, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(ID_PORTAL_GUN_LAVA);

const ID_PORTAL_GUN_WOOD_AND_STONE = 3655;
const PORTAL_GUN_WOOD_AND_STONE_DAMAGE = 100;
Item.defineItem(ID_PORTAL_GUN_WOOD_AND_STONE, "portalgunwoodandstone", 0, "PortalGun Wood & Stone");
Item.setMaxDamage(ID_PORTAL_GUN_WOOD_AND_STONE, PORTAL_GUN_WOOD_AND_STONE_DAMAGE);
Item.addShapedRecipe(ID_PORTAL_GUN_WOOD_AND_STONE, 1, 0, [
	"sws",
	"s s",
	"sws"], ["s", 98, 0, "w", 17, 0]);
Item.setCategory(ID_PORTAL_GUN_WOOD_AND_STONE, ITEM_CATEGORY_TOOL);
Item.setVerticalRender(ID_PORTAL_GUN_WOOD_AND_STONE);

const ID_PORTAL_GUN_ORANGE = 3649;
Item.defineItem(ID_PORTAL_GUN_ORANGE, "portalgunorange", 0, "PortalGun");
Item.setMaxDamage(ID_PORTAL_GUN_ORANGE, PORTAL_GUN_DAMAGE);
Item.setVerticalRender(ID_PORTAL_GUN_ORANGE);

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


//########################################################################################################################################################
// Hooks
//########################################################################################################################################################

function newLevel()
{
	isInGame = true;

	if(Level.getGameMode() == GameMode.CREATIVE)
	{
		// crashes in survival
		Player.addItemCreativeInv(ID_PORTAL_GUN_BLUE, 1);
		Player.addItemCreativeInv(ID_PORTAL_GUN_GOLD, 1);
		Player.addItemCreativeInv(ID_PORTAL_GUN_IRON, 1);
		Player.addItemCreativeInv(ID_PORTAL_GUN_LAVA, 1);
		Player.addItemCreativeInv(ID_PORTAL_GUN_WOOD_AND_STONE, 1);
		Player.addItemCreativeInv(GRAVITY_GUN_ID, 1);
		Player.addItemCreativeInv(RADIO_ID, 1);

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
}

function useItem(x, y, z, itemId, blockId, side, itemDamage)
{
	x = Math.floor(x);
	y = Math.floor(y);
	z = Math.floor(z);
	//clientMessage(Block.getRenderType(blockId)); // TODO fizzler

	clientMessage("x " + x + " y " + y + " z " + z);

	// PortalGun Wood & Stone
	if(itemId == ID_PORTAL_GUN_WOOD_AND_STONE)
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
		if(blockId != 7 && blockId != 26 && blockId != 52 && blockId != 54 && blockId != 59 && blockId != 61 && blockId != 62 && blockId != 63 && blockId != 64 && blockId != 68 && blockId != 71 && blockId != 83 && blockId != 90 && blockId != 96 && blockId != 104 && blockId != 105 && blockId != 106 && blockId != 111 && blockId != 115 && blockId != 141 && blockId != 142 && blockId != 207)
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
		if(blockId != 7 && blockId != 26 && blockId != 52 && blockId != 54 && blockId != 59 && blockId != 61 && blockId != 62 && blockId != 63 && blockId != 64 && blockId != 68 && blockId != 71 && blockId != 83 && blockId != 90 && blockId != 96 && blockId != 104 && blockId != 105 && blockId != 106 && blockId != 111 && blockId != 115 && blockId != 141 && blockId != 142 && blockId != 207)
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
}

function destroyBlock(x, y, z)
{
	// radio
	if(isRadioPlaying)
	{
		if(Math.floor(x) == Math.floor(radioX) && Math.floor(y) == Math.floor(radioY) && Math.floor(z) == Math.floor(radioZ))
		{
			stopRadioMusic();
		}
	}
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

		case ID_PORTAL_GUN_BLUE:
		case ID_PORTAL_GUN_GOLD:
		case ID_PORTAL_GUN_IRON:
		case ID_PORTAL_GUN_LAVA:
		case ID_PORTAL_GUN_ORANGE:
		{
			if(!isItemPortalGun(previousItem))
				showPortalGunUI();
			if(!((previousItem == ID_PORTAL_GUN_BLUE && currentItem == ID_PORTAL_GUN_ORANGE) || (previousItem == ID_PORTAL_GUN_ORANGE && currentItem == ID_PORTAL_GUN_BLUE)))
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

	ModTickFunctions.portalGunBullets();

	ModTickFunctions.portalGunPicking(); // portal gun picking entities

	ModTickFunctions.gravityGun(); // gravity gun picking entities

	ModTickFunctions.placeShotBlocks(); // gravity gun picking entities

	ModTickFunctions.gelBlue(blockUnderPlayer);

	ModTickFunctions.gelOrange(blockUnderPlayer);

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

	portalGunBullets: function()
	{
		if(blueBulletLaunched)
		{
			var xArrow = Entity.getX(blueBullet.entity);
			var yArrow = Entity.getY(blueBullet.entity);
			var zArrow = Entity.getZ(blueBullet.entity);
			if(blueBullet.previousX == xArrow && blueBullet.previousY == yArrow && blueBullet.previousZ == zArrow)
			{
				clientMessage("x " + Math.floor(xArrow) + " y " + Math.floor(yArrow) + " z " + Math.floor(zArrow));

				Entity.remove(blueBullet.entity);
				blueBullet = null;
				blueBulletLaunched = false;
			} else
			{
				if(xArrow == 0 && yArrow == 0 && zArrow == 0)
				{
					// the blueBullet hit an entity
					clientMessage("x " + Math.floor(xArrow) + " y " + Math.floor(yArrow) + " z " + Math.floor(zArrow));

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
				clientMessage("x " + Math.floor(xArrow) + " y " + Math.floor(yArrow) + " z " + Math.floor(zArrow));

				Entity.remove(orangeBullet.entity);
				orangeBullet = null;
				orangeBulletLaunched = false;
			} else
			{
				if(xArrow == 0 && yArrow == 0 && zArrow == 0)
				{
					// the orangeBullet hit an entity
					clientMessage("x " + Math.floor(xArrow) + " y " + Math.floor(yArrow) + " z " + Math.floor(zArrow));

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

//########## PORTAL GUN functions ##########
function isItemPortalGun(itemId)
{
	//
	return (itemId == ID_PORTAL_GUN_BLUE || itemId == ID_PORTAL_GUN_GOLD || itemId == ID_PORTAL_GUN_IRON || itemId == ID_PORTAL_GUN_LAVA || itemId == ID_PORTAL_GUN_ORANGE);
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
				var overlayImage = scaleImageToSize(overlayScaled, overlayScaled.getWidth() * 0.5, overlayScaled.getHeight() * 0.5, true);
				var overlayImageView = new android.widget.ImageView(currentActivity);
				overlayImageView.setImageBitmap(overlayImage);

				popupOverlay = new android.widget.PopupWindow(overlayImageView, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
				popupOverlay.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
				popupOverlay.setOutsideTouchable(false);
				popupOverlay.setFocusable(false);
				popupOverlay.setTouchable(false);
				popupOverlay.showAtLocation(currentActivity.getWindow().getDecorView(), android.view.Gravity.CENTER | android.view.Gravity.CENTER, 0, 0);
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
	if(Player.getCarriedItem() == ID_PORTAL_GUN_LAVA)
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
	if(Player.getCarriedItem() == ID_PORTAL_GUN_LAVA)
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
	if(portalGun == ID_PORTAL_GUN_BLUE || portalGun == ID_PORTAL_GUN_ORANGE)
		return 3;
	if(portalGun == ID_PORTAL_GUN_GOLD)
		return 1.8;
	if(portalGun == ID_PORTAL_GUN_IRON)
		return 1.2;
	if(portalGun == ID_PORTAL_GUN_LAVA)
		return 1.2;
}

function changeCarriedPortalGunColor()
{
	if(Player.getCarriedItem() == ID_PORTAL_GUN_BLUE || Player.getCarriedItem() == ID_PORTAL_GUN_ORANGE)
	{
		if(Player.getCarriedItem() == ID_PORTAL_GUN_BLUE)
			Entity.setCarriedItem(Player.getEntity(), ID_PORTAL_GUN_ORANGE, Player.getCarriedItemCount(), Player.getCarriedItemData());
		else
			Entity.setCarriedItem(Player.getEntity(), ID_PORTAL_GUN_BLUE,  Player.getCarriedItemCount(), Player.getCarriedItemData());
	}
}

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

function removePortalGunUI()
{
	pgIsPickingEnabled = false;
	isPortalGunPicking = false;
	pgEntity = null;
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
//########## PORTAL GUN functions ##########

//########## PORTAL functions ##########
var orangeInformation = [];
var blueInformation = [];
function savePortalAndDeleteOrange(){}
function savePortalAndDeleteBlue(){}

function setPortalOrange(x, y ,z)
{
	var pX = Player.getX();
	var pY = Player.getY();
	var pZ = Player.getZ();

	if(Level.getTile(x, y ,z) != 0)
	{
		//USE ITEM AND SNOWBALL
		if(Level.getTile(x, y + 1, z) != 0)
		{
			if(Math.abs(pX - x) > Math.abs(pZ - z))
			{
				if(x < pX)
				{
					if(Level.getTile(x + 1, y ,z) == 0 && Level.getTile(x + 1, y + 1 ,z) == 0)
					{

						Level.setTile(x + 1, y, z, ORANGE_X_MIN_D, 0);
						Level.setTile(x + 1, y + 1, z, ORANGE_X_MIN_U, 0);
						savePortalAndDeleteOrange(x+1, y, z, x+1, y+1, z);
						orangeInformation[6] = 5;
					}
				}else
				{
					if(Level.getTile(x - 1, y ,z) == 0 && Level.getTile(x - 1, y + 1 ,z) == 0)
					{

						Level.setTile(x - 1, y, z, ORANGE_X_MAX_D, 0);
						Level.setTile(x - 1, y + 1, z, ORANGE_X_MAX_U, 0);
						savePortalAndDeleteOrange(x-1, y, z, x-1, y+1, z);
						orangeInformation[6] = 6;
					}
				}
			}else
			{
				if(z < pZ)
				{
					if(Level.getTile(x, y ,z + 1) == 0 && Level.getTile(x, y + 1 ,z + 1) == 0)
					{

						Level.setTile(x, y, z + 1, ORANGE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z + 1, ORANGE_Z_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z+1, x, y+1, z+1);
						orangeInformation[6] = 1;
					}
				}else
				{
					if(Level.getTile(x, y ,z - 1) == 0 && Level.getTile(x, y + 1 ,z - 1) == 0)
					{

						Level.setTile(x, y, z - 1, ORANGE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z - 1, ORANGE_Z_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z-1, x, y+1, z-1);
						orangeInformation[6] = 2;
					}
				}
			}
		}else
		{
			if(Level.getTile(x, y + 1, z + 1) == 0)
			{

				Level.setTile(x, y + 1, z, ORANGE_Y_MIN_U);
				Level.setTile(x, y + 1, z + 1, ORANGE_Y_MIN_D);
				savePortalAndDeleteOrange(x, y+1, z, x, y+1, z+1);
				orangeInformation[6] = 3;
			}else
			if(Level.getTile(x, y + 1, z - 1) == 0)
			{

				Level.setTile(x, y + 1, z, ORANGE_Y_MIN_D);
				Level.setTile(x, y + 1, z - 1, ORANGE_Y_MIN_U);	
				savePortalAndDeleteOrange(x, y+1, z, x, y+1, z-1);
				orangeInformation[6] = 3;
			}
		}
	}else
	{
		//ARROW
		if(Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
		{
			if(Level.getTile(x, y - 1, z) != 0)
			{
				Level.setTile(x, y, z, ORANGE_Y_MIN_U);
				Level.setTile(x, y, z + 1, ORANGE_Y_MIN_D);
				savePortalAndDeleteOrange(x, y, z, x, y, z+1);
				orangeInformation[6] = 3;
				return;
			}else
			if(Level.getTile(x, y + 1, z) != 0)
			{
				Level.setTile(x, y, z, ORANGE_Y_MAX_U);
				Level.setTile(x, y, z + 1, ORANGE_Y_MAX_D);
				savePortalAndDeleteOrange(x, y, z, x, y, z+1);
				orangeInformation[6] = 4;
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
					savePortalAndDeleteOrange(x, y, z, x, y+1, z);
					orangeInformation[6] = 6;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MAX_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_X_MAX_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z);
						orangeInformation[6] = 6;
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
					savePortalAndDeleteOrange(x, y, z, x, y+1, z);
					orangeInformation[6] = 2;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MAX_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_Z_MAX_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z);
						orangeInformation[6] = 2;
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
					savePortalAndDeleteOrange(x, y, z, x, y+1, z);
					orangeInformation[6] = 5;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_X_MIN_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_X_MIN_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z);
						orangeInformation[6] = 5;
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
					savePortalAndDeleteOrange(x, y, z, x, y+1, z);
					orangeInformation[6] = 1;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MIN_U, 0);
						Level.setTile(x, y - 1, z, ORANGE_Z_MIN_D, 0);
						savePortalAndDeleteOrange(x, y, z, x, y-1, z);
						orangeInformation[6] = 1;
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
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 6;
					return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 6;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 2;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 2;
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
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 6;
					return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 6;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 1;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 1;
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
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 5;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 5;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MIN_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 1;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 1;
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
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 5;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_X_MIN_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 5;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, ORANGE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, ORANGE_Z_MAX_U, 0);
						savePortalAndDeleteOrange(x, y, z, x, y+1, z);
						orangeInformation[6] = 2;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, ORANGE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, ORANGE_Z_MAX_D, 0);
							savePortalAndDeleteOrange(x, y, z, x, y-1, z);
							orangeInformation[6] = 2;
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
		// USE ITEM AND SNOWBALL
		if(Level.getTile(x, y + 1, z) != 0)
		{
			if(Math.abs(pX - x) > Math.abs(pZ - z))
			{
				if(x < pX)
				{
					if(Level.getTile(x + 1, y ,z) == 0 && Level.getTile(x + 1, y + 1 ,z) == 0)
					{

						Level.setTile(x + 1, y, z, BLUE_X_MIN_D, 0);
						Level.setTile(x + 1, y + 1, z, BLUE_X_MIN_U, 0);
						savePortalAndDeleteBlue(x+1, y, z, x+1, y+1, z);
						blueInformation[6] = 5;
					}
				}else
				{
					if(Level.getTile(x - 1, y ,z) == 0 && Level.getTile(x - 1, y + 1 ,z) == 0)
					{

						Level.setTile(x - 1, y, z, BLUE_X_MAX_D, 0);
						Level.setTile(x - 1, y + 1, z, BLUE_X_MAX_U, 0);
						savePortalAndDeleteBlue(x-1, y, z, x-1, y+1, z);
						blueInformation[6] = 6;
					}
				}
			}else
			{
				if(z < pZ)
				{
					if(Level.getTile(x, y ,z + 1) == 0 && Level.getTile(x, y + 1 ,z + 1) == 0)
					{

						Level.setTile(x, y, z + 1, BLUE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z + 1, BLUE_Z_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z+1, x, y+1, z+1);
						blueInformation[6] = 1;
					}
				}else
				{
					if(Level.getTile(x, y ,z - 1) == 0 && Level.getTile(x, y + 1 ,z - 1) == 0)
					{

						Level.setTile(x, y, z - 1, BLUE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z - 1, BLUE_Z_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z-1, x, y+1, z-1);
						blueInformation[6] = 2;
					}
				}
			}
		}else
		{
			if(Level.getTile(x, y + 1,z + 1) == 0)
			{

				Level.setTile(x, y + 1, z, BLUE_Y_MIN_U, 0);
				Level.setTile(x, y + 1, z + 1, BLUE_Y_MIN_D, 0);
				savePortalAndDeleteBlue(x, y+1, z, x, y+1, z+1);
				blueInformation[6] = 3;
			}else
			if(Level.getTile(x, y + 1,z - 1) == 0)
			{

				Level.setTile(x, y + 1, z, BLUE_Y_MIN_D, 0);
				Level.setTile(x, y + 1, z - 1, BLUE_Y_MIN_U, 0);	
				savePortalAndDeleteBlue(x, y+1, z, x, y+1, z-1);
				blueInformation[6] = 3;
			}
		}
	}else
	{
		//ARROW
		if(Level.getTile(x + 1, y, z) == 0 && Level.getTile(x - 1, y, z) == 0 && Level.getTile(x, y, z + 1) == 0 && Level.getTile(x, y, z - 1) == 0)
		{
			if(Level.getTile(x, y - 1, z) != 0)
			{
				Level.setTile(x, y, z, BLUE_Y_MIN_U);
				Level.setTile(x, y, z + 1, BLUE_Y_MIN_D);
				savePortalAndDeleteBlue(x, y, z, x, y, z+1);
				blueInformation[6] = 3;
			return;
			}else
			if(Level.getTile(x, y + 1, z) != 0)
			{
				Level.setTile(x, y, z, BLUE_Y_MAX_U);
				Level.setTile(x, y, z + 1, BLUE_Y_MAX_D);
				savePortalAndDeleteBlue(x, y, z, x, y, z+1);
				blueInformation[6] = 4;
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
					savePortalAndDeleteBlue(x, y, z, x, y+1, z);
					blueInformation[6] = 6;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MAX_U, 0);
						Level.setTile(x, y - 1, z, BLUE_X_MAX_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z);
						blueInformation[6] = 6;
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
					savePortalAndDeleteBlue(x, y, z, x, y+1, z);
					blueInformation[6] = 2;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MAX_U, 0);
						Level.setTile(x, y - 1, z, BLUE_Z_MAX_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z);
						blueInformation[6] = 2;
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
					savePortalAndDeleteBlue(x, y, z, x, y+1, z);
					blueInformation[6] = 5;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_X_MIN_U, 0);
						Level.setTile(x, y - 1, z, BLUE_X_MIN_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z);
						blueInformation[6] = 5;
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
					savePortalAndDeleteBlue(x, y, z, x, y+1, z);
					blueInformation[6] = 1;
					return;
				}else
				{
					if(Level.getTile(x, y - 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MIN_U, 0);
						Level.setTile(x, y - 1, z, BLUE_Z_MIN_D, 0);
						savePortalAndDeleteBlue(x, y, z, x, y-1, z);
						blueInformation[6] = 1;
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
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 6;
					return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 6;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 2;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 2;
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
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 6;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 6;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 1;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 1;
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
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 5;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 5;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MIN_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MIN_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 1;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 1;
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
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 5;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_X_MIN_U, 0);
							Level.setTile(x, y - 1, z, BLUE_X_MIN_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 5;
							return;
						}
					}
				}else
				{

					if(Level.getTile(x, y + 1, z) == 0)
					{
						Level.setTile(x, y, z, BLUE_Z_MAX_D, 0);
						Level.setTile(x, y + 1, z, BLUE_Z_MAX_U, 0);
						savePortalAndDeleteBlue(x, y, z, x, y+1, z);
						blueInformation[6] = 2;
						return;
					}else
					{
						if(Level.getTile(x, y - 1, z) == 0)
						{
							Level.setTile(x, y, z, BLUE_Z_MAX_U, 0);
							Level.setTile(x, y - 1, z, BLUE_Z_MAX_D, 0);
							savePortalAndDeleteBlue(x, y, z, x, y-1, z);
							blueInformation[6] = 2;
							return;
						}
					}
				}
			}
		}
	}
}
//########## PORTAL functions ##########

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
//########## LONG FALl BOOTS functions ##########

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
//########## RADIO functions ##########

//########## BLUE GEL functions ##########
function makeBounceSound()
{
	var random = Math.floor((Math.random() * 2) + 1);
	Sound.playFromFileName("gelblue/player_bounce_jump_paint_0" + random + ".wav");
}
//########## BLUE GEL functions ##########

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
	if(Player.getCarriedItem() == ID_PORTAL_GUN_ORANGE || Player.getCarriedItem() == ID_PORTAL_GUN_BLUE)
		maxDamage = PORTAL_GUN_DAMAGE;
	if(Player.getCarriedItem() == ID_PORTAL_GUN_GOLD)
		maxDamage = PORTAL_GUN_GOLD_DAMAGE;
	if(Player.getCarriedItem() == ID_PORTAL_GUN_IRON)
		maxDamage = PORTAL_GUN_IRON_DAMAGE;
	if(Player.getCarriedItem() == ID_PORTAL_GUN_LAVA)
		maxDamage = PORTAL_GUN_LAVA_DAMAGE;
	if(Player.getCarriedItem() == ID_PORTAL_GUN_WOOD_AND_STONE)
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
	var bluePortalDecoded = decodeImageFromBase64(bluePortal);
	bluePortalScaled = scaleImageToDensity(bluePortalDecoded);
	bluePortal = null;

	var orangePortalDecoded = decodeImageFromBase64(orangePortal);
	orangePortalScaled = scaleImageToDensity(orangePortalDecoded);
	orangePortal = null;

	var overlayDecoded = decodeImageFromBase64(overlay);
	overlayScaled = scaleImageToDensity(overlayDecoded);
	overlay = null;

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

