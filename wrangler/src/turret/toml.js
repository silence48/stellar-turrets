import { response } from "cfw-easy-utils";
import { TurretErrorHandler } from "../@utils/parse";

/**
 * @function handleToml()
 * @description The handleToml() function constructs and returns the stellar.toml with metadata regarding the
 *              turrets trust quorum.
 *
 * @export
 * @param {IncomingRequestCfProperties} { env } - the Env is the CF workers environment, defined in the GlobalEnv interface.
 * @return {Promise<stellartoml>} The return is the stellar.toml file.
 */
export default async function handleToml({ env }) {
  try {
    const { META } = env;
    const stellarToml = await META.get("STELLAR_TOML");

    if (!stellarToml)
      throw {
        status: 404,
        message: `stellar.toml file could not be found on this turret`,
      };

    return response.text(stellarToml, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=2419200", // 28 days
      },
    });
  } catch (err) {
    return new TurretErrorHandler(
      {
        message:
          "an error occurred while retrieving the stellar.toml, try again or contact admin",
        statuscode: 404,
      },
      404,
      err
    ).logCodeError(err);
  }
}
