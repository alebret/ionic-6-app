package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {

    // Important : le mettre avant le super.onCreate
    registerPlugin(EchoPlugin.class);

    super.onCreate(savedInstanceState);
  }
}
