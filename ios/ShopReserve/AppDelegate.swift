import UIKit
#if canImport(React)
    import React
#endif
#if canImport(React_RCTAppDelegate)
    import React_RCTAppDelegate
#endif
#if canImport(ReactAppDependencyProvider)
    import ReactAppDependencyProvider
#endif
import RNBootSplash
import GoogleMaps
import Firebase
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize Firebase FIRST
    FirebaseApp.configure()
    
    // Set up notifications
    UNUserNotificationCenter.current().delegate = self
    
    // Configure Google Maps
    GMSServices.provideAPIKey("AIzaSyDHMslMEKLhI1zKIswkqSuG4p25Hq4FrU0")
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    let rootView = reactNativeFactory!.rootViewFactory.view(withModuleName: "SimplirideDriver")
    
    let reactViewController = UIViewController()
    reactViewController.view = rootView

    let navigationController = UINavigationController(rootViewController: reactViewController)
    navigationController.setNavigationBarHidden(true, animated: false)

    window?.rootViewController = navigationController
    window?.makeKeyAndVisible()

    return true
  }
  
  // MARK: - Push Notifications
  
  // Handle notification when app is in foreground
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    let userInfo = notification.request.content.userInfo
    
    // Print for debugging
    print("Notification received in foreground: \(userInfo)")
    
    // Show notification even when app is in foreground
    completionHandler([[.banner, .badge, .sound]])
  }
  
  // Handle notification tap
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    let userInfo = response.notification.request.content.userInfo
    
    // Print for debugging
    print("Notification tapped: \(userInfo)")
    
    completionHandler()
  }
  
  // Handle remote notifications
  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    // Print for debugging
    print("Remote notification received: \(userInfo)")
    
    completionHandler(.newData)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
