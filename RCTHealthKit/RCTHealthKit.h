//
//  RCTHealthKit.h
//  RCTHealthKit
//
//  Created by Spencer Elliott on 2015-09-06.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@import HealthKit;

@interface KOHealthKit : NSObject <RCTBridgeModule>

@property (readonly) HKHealthStore *healthStore;

@end
