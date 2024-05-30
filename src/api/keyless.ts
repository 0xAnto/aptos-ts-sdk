// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { EphemeralKeyPair, KeylessAccount, ProofFetchCallback } from "../account";
import { deriveKeylessAccount, generateEphemeralKeyPair, getPepper } from "../internal/keyless";
import { EphemeralPublicKeyVariant, HexInput } from "../types";
import { AptosConfig } from "./aptosConfig";

/**
 * A class to query all `Keyless` related queries on Aptos.
 *
 * More documentation on how to integrate Keyless Accounts see the below
 * https://aptos.dev/guides/keyless-accounts/#aptos-keyless-integration-guide
 */
export class Keyless {
  constructor(readonly config: AptosConfig) {}

  /**
   * Generates an EphemeralKeyPair. It checks the maxExpHorizonSecs set on chain at 0x1::keyless_account::Configuration to
   * ensure the expiry date is valid.  If expiryDateSecs is not set, defaults setting the expiry to the maximum allowed
   * with respect to the Keyless configuration.
   *
   * @param scheme the type of keypair to use for the EphemeralKeyPair.  Only Ed25519 supported for now.
   * @param expiryDateSecs the date of expiry.
   * @returns EphemeralKeyPair
   */
  async generateEphemeralKeyPair(args?: {
    scheme?: EphemeralPublicKeyVariant;
    expiryDateSecs?: number;
  }): Promise<EphemeralKeyPair> {
    return generateEphemeralKeyPair({ aptosConfig: this.config, ...args });
  }

  /**
   * Fetches the pepper from the Aptos pepper service API.
   *
   * @param args.jwt JWT token
   * @param args.ephemeralKeyPair the EphemeralKeyPair used to generate the nonce in the JWT token
   * @returns The pepper which is a Uint8Array of length 31.
   */
  async getPepper(args: { jwt: string; ephemeralKeyPair: EphemeralKeyPair }): Promise<Uint8Array> {
    return getPepper({ aptosConfig: this.config, ...args });
  }

  /**
   * Fetches the pepper from the Aptos pepper service API.
   *
   * @param args.jwt JWT token
   * @param args.ephemeralKeyPair the EphemeralKeyPair used to generate the nonce in the JWT token
   * @param args.uidKey a key in the JWT token to use to set the uidVal in the IdCommitment
   * @param args.pepper the pepper
   * @param args.proofFetchCallback a callback function that if set, the fetch of the proof will be done in the background. Once
   * fetching finishes the callback function will be called.  This should be used to provide a more responsive user experience as now
   * they are not blocked on fetching the proof. Thus the function will return much more quickly.
   *
   * @returns A KeylessAccount that can be used to sign transactions
   */
  async deriveKeylessAccount(args: {
    jwt: string;
    ephemeralKeyPair: EphemeralKeyPair;
    uidKey?: string;
    pepper?: HexInput;
    proofFetchCallback?: ProofFetchCallback;
  }): Promise<KeylessAccount> {
    return deriveKeylessAccount({ aptosConfig: this.config, ...args });
  }
}
