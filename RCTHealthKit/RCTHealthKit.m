//
//  RCTHealthKit.m
//  RCTHealthKit
//
//  Created by Spencer Elliott on 2015-09-06.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RCTHealthKit.h"

@implementation KOHealthKit

@synthesize healthStore = _healthStore;

- (HKHealthStore *)healthStore
{
    if (!_healthStore) _healthStore = [[HKHealthStore alloc] init];
    return _healthStore;
}

+ (NSSet *)typesSetFromDictionary:(NSDictionary *)types
{
    NSSet *typesSet = [NSSet set];
    if (types[@"category"]) {
        for (NSString *typeIdentifier in types[@"category"]) {
            HKCategoryType *categoryType = [HKObjectType categoryTypeForIdentifier:typeIdentifier];
            typesSet = [typesSet setByAddingObject:categoryType];
        }
    }
    if (types[@"quantity"]) {
        for (NSString *typeIdentifier in types[@"quantity"]) {
            HKQuantityType *quantityType = [HKObjectType quantityTypeForIdentifier:typeIdentifier];
            typesSet = [typesSet setByAddingObject:quantityType];
        }
    }
    if (types[@"characteristic"]) {
        for (NSString *typeIdentifier in types[@"characteristic"]) {
            HKCharacteristicType *characteristicType = [HKObjectType characteristicTypeForIdentifier:typeIdentifier];
            typesSet = [typesSet setByAddingObject:characteristicType];
        }
    }
    if (types[@"correlation"]) {
        for (NSString *typeIdentifier in types[@"correlation"]) {
            HKCorrelationType *correlationType = [HKObjectType correlationTypeForIdentifier:typeIdentifier];
            typesSet = [typesSet setByAddingObject:correlationType];
        }
    }
    if (types[@"workout"]) {
        HKWorkoutType *workoutType = [HKObjectType workoutType];
        typesSet = [typesSet setByAddingObject:workoutType];
    }
    return typesSet;
}

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
    return @{
             @"BiologicalSex": @{
                     @"NotSet": [NSNumber numberWithInteger:HKBiologicalSexNotSet],
                     @"Female": [NSNumber numberWithInteger:HKBiologicalSexFemale],
                     @"Male": [NSNumber numberWithInteger:HKBiologicalSexMale],
                     @"Other": [NSNumber numberWithInteger:HKBiologicalSexOther]
                     },
             @"SleepAnalysis": @{
                     @"InBed": [NSNumber numberWithInteger:HKCategoryValueSleepAnalysisInBed],
                     @"Asleep": [NSNumber numberWithInteger:HKCategoryValueSleepAnalysisAsleep]
                     }
             };
}

RCT_EXPORT_METHOD(isHealthDataAvailable:(RCTResponseSenderBlock)callback)
{
    BOOL isHealthDataAvailable = [HKHealthStore isHealthDataAvailable];
    callback(@[[NSNull null], [NSNumber numberWithBool:isHealthDataAvailable]]);
}

RCT_EXPORT_METHOD(requestAuthorizationToShareTypes:(NSDictionary *)typesToShare
                  readTypes:(NSDictionary *)typesToRead
                  callback:(RCTResponseSenderBlock)callback)
{
    NSSet *typesToShareSet = [KOHealthKit typesSetFromDictionary:typesToShare];
    NSSet *typesToReadSet = [KOHealthKit typesSetFromDictionary:typesToRead];
    [self.healthStore requestAuthorizationToShareTypes:typesToShareSet readTypes:typesToReadSet completion:^(BOOL success, NSError *error) {
        if (!success) {
            callback(@[@"Failed to authorize HealthKit", [NSNumber numberWithBool:success]]);
            return;
        }
        
        callback(@[[NSNull null], [NSNumber numberWithBool:success]]);
    }];
}

RCT_EXPORT_METHOD(getBiologicalSex:(RCTResponseSenderBlock)callback)
{
    NSError *error;
    HKBiologicalSexObject *bso = [self.healthStore biologicalSexWithError:&error];
    callback(@[error ? error.description : [NSNull null], [NSNumber numberWithInteger:bso.biologicalSex]]);
}

RCT_EXPORT_METHOD(queryCategorySample:(NSString *)typeIdentifier
                  startDate:(NSString *)startDateString  // e.g. @"2014-02-07T03:10:59:434Z"
                  endDate:(NSString *)endDateString
                  callback:(RCTResponseSenderBlock)callback)
{
    // Parse dates
    NSDate *startDate = [KOUtils parseISO8601DateFromString:startDateString];
    NSDate *endDate = [KOUtils parseISO8601DateFromString:endDateString];
    
    // Build the query
    HKSampleType *sampleType = [HKSampleType categoryTypeForIdentifier:typeIdentifier];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:startDate endDate:endDate options:HKQueryOptionNone];
    HKSampleQuery *query = [[HKSampleQuery alloc]
                            initWithSampleType:sampleType
                            predicate:predicate
                            limit:HKObjectQueryNoLimit
                            sortDescriptors:nil
                            resultsHandler:^(HKSampleQuery *query, NSArray *results, NSError *error) {
                                NSMutableArray *plainResults = [NSMutableArray new];
                                for (HKCategorySample *sample in results) {
                                    // Convert samples to plain NSDictionary / NSString / NSNumber
                                    [plainResults addObject:@{
                                                              @"startDate": [KOUtils buildISO8601StringFromDate:sample.startDate],
                                                              @"endDate": [KOUtils buildISO8601StringFromDate:sample.endDate],
                                                              @"sampleType": sample.sampleType.identifier,
                                                              @"categoryType": sample.categoryType.identifier,
                                                              @"value": [NSNumber numberWithLong:sample.value]
                                                              }];
                                }
                                callback(@[error ? error.description : [NSNull null], plainResults]);
                            }];
    
    // Execute the query
    [self.healthStore executeQuery:query];
}

RCT_EXPORT_METHOD(queryStatistics:(NSString *)typeIdentifier
                  startDate:(NSString *)startDateString
                  endDate:(NSString *)endDateString
                  unit:(NSString *)unitString
                  callback:(RCTResponseSenderBlock)callback)
{
    // Parse dates
    NSDate *startDate = [KOUtils parseISO8601DateFromString:startDateString];
    NSDate *endDate = [KOUtils parseISO8601DateFromString:endDateString];
    
    // Build query
    HKQuantityType *sampleType = [HKQuantityType quantityTypeForIdentifier:typeIdentifier];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:startDate endDate:endDate options:HKQueryOptionStrictStartDate];
    HKStatisticsQuery *query = [[HKStatisticsQuery alloc]
                                initWithQuantityType:sampleType
                                quantitySamplePredicate:predicate
                                options:HKStatisticsOptionCumulativeSum
                                completionHandler:^(HKStatisticsQuery *query, HKStatistics *result, NSError *error) {
                                    if (!result) {
                                        return;
                                    }
                                    
                                    double totalNutrients = [result.sumQuantity doubleValueForUnit:[HKUnit unitFromString:unitString]];
                                    NSNumber *nsTotalNutrients = [NSNumber numberWithDouble:totalNutrients];
                                    
                                    NSMutableArray *plainResults = [NSMutableArray new];
                                    [plainResults addObject:@{
                                                              @"startDate": [KOUtils buildISO8601StringFromDate:result.startDate],
                                                              @"endDate": [KOUtils buildISO8601StringFromDate:result.endDate],
                                                              @"quantityType": result.quantityType.identifier,
                                                              @"value": nsTotalNutrients
                                                              }];
                                    
                                    callback(@[error ? error.description : [NSNull null], plainResults]);
                                }];
    
    // Execute the query
    [self.healthStore executeQuery:query];
    
}


@end
