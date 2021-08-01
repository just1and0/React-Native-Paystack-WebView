//
//  ReactNativePaystackWebviewModule.swift
//  ReactNativePaystackWebviewModule
//
//  Copyright © 2021 Oluwatobi Shokunbi . All rights reserved.
//

import Foundation

@objc(ReactNativePaystackWebviewModule)
class ReactNativePaystackWebviewModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
