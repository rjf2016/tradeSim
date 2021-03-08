/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <RNGoogleSignin/RNGoogleSignin.h>
#import <TwitterKit/TWTRKit.h>

#import <ReactNativeNavigation/ReactNativeNavigation.h>

@import GoogleMobileAds;
#import <GoogleMobileAds/GoogleMobileAds.h>

#import "RNSplashScreen.h"  // here

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  
  [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
  
  [RNSplashScreen show];  
  
  
  return YES;
}


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  return [[Twitter sharedInstance] application:app openURL:url options:options];
}


/*
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
    NSString *stringurl = url.absoluteString;
    NSString *sub = @"twitterkit";
    NSRange range = [stringurl  rangeOfString: sub options: NSCaseInsensitiveSearch];
    if (range.location != NSNotFound){
    return [[Twitter sharedInstance] application:application openURL:url options:options];
    }
    else{
      BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                      ] || [RNGoogleSignin application:application
                                               openURL:url
                                     sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                            annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                            ];;
      return handled;
    }
  }
*/

/*
//working!
- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
  return [RNGoogleSignin application:application
                             openURL:url
                   sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                          annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
}
*/ 

/*
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"TradeSim"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
*/
@end
